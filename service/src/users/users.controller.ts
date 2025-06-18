import { Body, Controller, Get, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const token = await this.usersService.validate(body.username, body.password);
    if (!token) throw new UnauthorizedException();
    return { token };
  }

  @Get('profile')
  async profile(@Headers('authorization') auth: string) {
    if (!auth) throw new UnauthorizedException();
    const token = auth.replace('Bearer ', '');
    const profile = await this.usersService.profile(token);
    if (!profile) throw new UnauthorizedException();
    return profile;
  }
}
