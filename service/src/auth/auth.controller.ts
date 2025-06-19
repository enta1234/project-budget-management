import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) throw new UnauthorizedException();
    const accessToken = this.authService.signToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const userId = await this.authService.verifyRefreshToken(body.refreshToken);
    if (!userId) throw new UnauthorizedException();
    const accessToken = this.authService.signToken(userId);
    return { accessToken };
  }

  @Post('revoke')
  async revoke(@Body() body: { refreshToken: string }) {
    await this.authService.revokeToken(body.refreshToken);
    return { success: true };
  }
}
