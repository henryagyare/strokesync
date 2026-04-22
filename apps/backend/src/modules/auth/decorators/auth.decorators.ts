import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../guards/roles.guard';

/**
 * Decorator to restrict endpoint access to specific roles.
 * Accepts string literals to avoid enum-mismatch between Prisma and shared types.
 * @example @Roles('NEUROLOGIST', 'ADMIN')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Decorator to mark an endpoint as public (no auth required)
 */
export const Public = () => SetMetadata('isPublic', true);
