import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: Request) {
    const profile = await this.usersService.getProfile((req as any).userId);
    if (!profile) throw new UnauthorizedException();
    return profile;
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  getUsers() {
    return this.usersService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Post('users')
  create(@Body() body: { username: string }) {
    return this.usersService.createUser(body.username);
  }
}
