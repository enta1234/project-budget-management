import { Module } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ResourcesModule } from './resources/resources.module';
import { RedisModule } from './redis.module';
import { EventsModule } from './events/events.module';
import { FollowersModule } from './followers/followers.module';
import { ProjectsModule } from './projects/projects.module';
import { TeamsModule } from './teams/teams.module';
import { BudgetsModule } from './budgets/budgets.module';
import { PositionsModule } from './positions/positions.module';
import { RolesModule } from './roles/roles.module';
import { WorkdaysModule } from './workdays/workdays.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { PlanningModule } from './planning/planning.module';
import { SettingsModule } from './settings/settings.module';
import { IndexInitializer } from './index.initializer';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://mongo:27017/budget',
      { autoIndex: true },
    ),
    RedisModule,
    UsersModule,
    ResourcesModule,
    EventsModule,
    FollowersModule,
    ProjectsModule,
    TeamsModule,
    BudgetsModule,
    PositionsModule,
    RolesModule,
    WorkdaysModule,
    ActivityLogsModule,
    PlanningModule,
    SettingsModule,
  ],
  providers: [LoggerService, IndexInitializer],
  exports: [LoggerService],
})
export class AppModule {}
