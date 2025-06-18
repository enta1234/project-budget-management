import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  create(username: string, passwordHash: string): Promise<User> {
    const user = new this.userModel({ username, passwordHash });
    return user.save();
  }
}
