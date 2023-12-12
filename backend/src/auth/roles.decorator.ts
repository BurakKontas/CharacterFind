import { SetMetadata } from '@nestjs/common';
import AuthRoles from 'src/Enums/authRoles';

export const Roles = (...args: AuthRoles[]) => SetMetadata('roles', args);
