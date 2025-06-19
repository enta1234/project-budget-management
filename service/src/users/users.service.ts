import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './data/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async getProfile(id: string): Promise<{ username: string } | null> {
    const user = await this.repo.findById(id);
    if (!user) return null;
    return { username: user.username };
  }

  async getUsers(): Promise<{ id: string; username: string }[]> {
    const users = await this.repo.findAll();
    return users.map(u => ({ id: u._id.toString(), username: u.username }));
  }

  async createUser(username: string) {
    const hash = bcrypt.hashSync('changeit', 10);
    return this.repo.create(username, hash);
  }
}
