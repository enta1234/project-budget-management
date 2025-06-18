import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) throw new UnauthorizedException();
    const token = this.authService.signToken(user.id);
    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: Request) {
    const profile = await this.usersService.getProfile((req as any).userId);
    if (!profile) throw new UnauthorizedException();
    return profile;
  }
}
