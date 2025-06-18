import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UsersRepository } from '../users/users.repository';
import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
  private readonly SECRET = process.env.SECRET || 'replace_this_secret';

  constructor(private readonly usersRepo: UsersRepository) {}

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
}
