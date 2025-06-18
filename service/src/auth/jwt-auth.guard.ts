import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];
    if (!auth) throw new UnauthorizedException();
    const token = auth.replace('Bearer ', '');
    const payload = this.authService.verifyToken(token);
    if (!payload) throw new UnauthorizedException();
    request.userId = payload.sub;
    return true;
  }
}
