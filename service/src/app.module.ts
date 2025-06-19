import { Module } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis.module';
import { EventsModule } from './events/events.module';
import { FollowersModule } from './followers/followers.module';
import { ProjectsModule } from './projects/projects.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://mongo:27017/budget'),
    RedisModule,
    UsersModule,
    EventsModule,
    FollowersModule,
    ProjectsModule,
    TeamsModule,
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class AppModule {}
