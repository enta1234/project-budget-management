import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  private readonly SECRET = process.env.SECRET || 'replace_this_secret';

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async validate(username: string, password: string): Promise<string | null> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) return null;
    const valid = bcrypt.compareSync(password, user.passwordHash);
    if (!valid) return null;
    return jwt.sign({ sub: user.id }, this.SECRET, { expiresIn: '1h' });
  }

  async profile(token: string): Promise<{ username: string } | null> {
    try {
      const decoded: any = jwt.verify(token, this.SECRET);
      const user = await this.userModel.findById(decoded.sub).exec();
      if (!user) return null;
      return { username: user.username };
    } catch {
      return null;
    }
  }
}
