import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UsersRepository } from '../users/data/users.repository';
import { User } from '../users/data/user.schema';
import { randomBytes } from 'crypto';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  private readonly SECRET = process.env.SECRET || 'replace_this_secret';

  constructor(
    private readonly usersRepo: UsersRepository,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersRepo.findByUsername(username);
    if (!user) return null;
    const valid = bcrypt.compareSync(password, user.passwordHash);
    return valid ? user : null;
  }

  signToken(userId: string): string {
    return jwt.sign({ sub: userId }, this.SECRET, { expiresIn: '1h' });
  }

  verifyToken(token: string): { sub: string } | null {
    try {
      return jwt.verify(token, this.SECRET) as any;
    } catch {
      return null;
    }
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    await this.redis.set(`refresh:${token}`, userId, 'EX', 60 * 60 * 24 * 7);
    return token;
  }

  async verifyRefreshToken(token: string): Promise<string | null> {
    return this.redis.get(`refresh:${token}`);
  }

  async revokeToken(token: string): Promise<void> {
    await this.redis.del(`refresh:${token}`);
  }
}
