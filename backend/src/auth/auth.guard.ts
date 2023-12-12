import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import AuthRoles from 'src/Enums/authRoles';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles = this.getRoles(context);
    if (roles.length === 0) {
      throw new UnauthorizedException('No roles specified');
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    return this.validateToken(token, roles, request);
  }

  private getRoles(context: ExecutionContext): AuthRoles[] {
    const roles = Reflect.getMetadata('roles', context.getHandler());
    if (roles) {
      return roles;
    }
    return [];
  }

  private async validateToken(token: string, roles: AuthRoles[], request: Request): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      const userRole: AuthRoles = payload.role; // Assuming role is stored in the payload
      if (!roles.includes(userRole)) {
        throw new UnauthorizedException('You do not have permission to perform this action');
      }

      // Assign the payload to the request object
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
