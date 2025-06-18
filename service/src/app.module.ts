import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://mongo:27017/budget'),
    RedisModule,
    UsersModule,
  ],
})
export class AppModule {}
