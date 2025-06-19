import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';
import { FollowersRepository } from './data/followers.repository';
import { Follower, FollowerSchema } from './data/follower.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Follower.name, schema: FollowerSchema }])],
  controllers: [FollowersController],
  providers: [FollowersService, FollowersRepository],
})
export class FollowersModule {}
