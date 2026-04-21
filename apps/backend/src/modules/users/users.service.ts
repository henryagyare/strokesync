import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, UserStatus } from '@strokesync/shared';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: { role?: UserRole; status?: UserStatus }) {
    return this.prisma.user.findMany({
      where: {
        role: params?.role,
        status: params?.status,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        specialization: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        phoneNumber: true,
        licenseNumber: true,
        specialization: true,
        profileImageUrl: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getAvailableNeurologists() {
    return this.prisma.user.findMany({
      where: { role: 'NEUROLOGIST', status: 'ACTIVE' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        specialization: true,
        lastLoginAt: true,
      },
    });
  }
}
