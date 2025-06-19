import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follower } from './follower.schema';

@Injectable()
export class FollowersRepository {
  constructor(@InjectModel(Follower.name) private followerModel: Model<Follower>) {}

  create(name: string, email: string): Promise<Follower> {
    const follower = new this.followerModel({ name, email });
    return follower.save();
  }
}
