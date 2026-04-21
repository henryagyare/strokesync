import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@strokesync/shared';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  licenseNumber?: string;
  specialization?: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(payload: RegisterPayload) {
    const existing = await this.prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: payload.email,
        passwordHash,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
        phoneNumber: payload.phoneNumber,
        licenseNumber: payload.licenseNumber,
        specialization: payload.specialization,
      },
    });

    const tokens = await this.generateTokens({ sub: user.id, email: user.email, role: user.role });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CREATE',
        resource: 'AUTH',
        resourceId: user.id,
        description: `User registered: ${user.email}`,
        phiAccessed: true,
      },
    });

    this.logger.log(`User registered: ${user.email} (${user.role})`);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
      tokens,
    };
  }

  async login(payload: LoginPayload) {
    const user = await this.prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      await this.prisma.auditLog.create({
        data: {
          action: 'LOGIN_FAILED',
          resource: 'AUTH',
          description: `Failed login attempt for: ${payload.email}`,
          phiAccessed: false,
        },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isPasswordValid) {
      await this.prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN_FAILED',
          resource: 'AUTH',
          resourceId: user.id,
          description: `Failed login attempt for: ${user.email}`,
          phiAccessed: false,
        },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens({ sub: user.id, email: user.email, role: user.role });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        resource: 'AUTH',
        resourceId: user.id,
        description: `User logged in: ${user.email}`,
        phiAccessed: false,
      },
    });

    this.logger.log(`User logged in: ${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
      tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Revoke old token
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.generateTokens({ sub: user.id, email: user.email, role: user.role });
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
      },
    });
  }

  private async generateTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload);
    
    const refreshExpiry = this.config.get<string>('JWT_REFRESH_TOKEN_EXPIRY', '7d');
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshExpiry,
    });

    // Store refresh token
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.sub,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }
}
