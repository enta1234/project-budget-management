import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersController } from './users.controller';
import { UsersRepository } from './data/users.repository';
import { UsersService } from './users.service';
import { User, UserSchema } from './data/user.schema';
import { AdminInitializer } from './admin.initializer';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AdminInitializer, AuthService, JwtAuthGuard],
})
export class UsersModule {}
