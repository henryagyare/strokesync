// ─── User Domain Types ─────────────────────────────────────

export enum UserRole {
  TECHNICIAN = 'TECHNICIAN',
  NEUROLOGIST = 'NEUROLOGIST',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber?: string;
  licenseNumber?: string;
  specialization?: string;
  profileImageUrl?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  licenseNumber?: string;
  specialization?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  licenseNumber?: string;
  specialization?: string;
  profileImageUrl?: string;
  status?: UserStatus;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: Omit<User, 'createdAt' | 'updatedAt'>;
  tokens: AuthTokens;
}
