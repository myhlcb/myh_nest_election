import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<string>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user?.role === requiredRole;
  }
}
