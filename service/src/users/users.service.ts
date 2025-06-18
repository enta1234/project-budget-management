import { Injectable } from '@nestjs/common';
import { UsersRepository } from './data/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async getProfile(id: string): Promise<{ username: string } | null> {
    const user = await this.repo.findById(id);
    if (!user) return null;
    return { username: user.username };
  }
}
