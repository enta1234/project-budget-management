import { Injectable } from '@nestjs/common';
import { FollowersRepository } from './data/followers.repository';

@Injectable()
export class FollowersService {
  constructor(private readonly repo: FollowersRepository) {}

  create(name: string, email: string) {
    return this.repo.create(name, email);
  }
}
