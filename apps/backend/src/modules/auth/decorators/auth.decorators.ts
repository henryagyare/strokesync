import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@strokesync/shared';
import { ROLES_KEY } from '../guards/roles.guard';

/**
 * Decorator to restrict endpoint access to specific roles
 * @example @Roles('NEUROLOGIST', 'ADMIN')
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Decorator to mark an endpoint as public (no auth required)
 */
export const Public = () => SetMetadata('isPublic', true);
