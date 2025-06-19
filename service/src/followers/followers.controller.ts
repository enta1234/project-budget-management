import { Body, Controller, Post } from '@nestjs/common';
import { FollowersService } from './followers.service';

@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post()
  create(@Body() body: { name: string; email: string }) {
    return this.followersService.create(body.name, body.email);
  }
}
