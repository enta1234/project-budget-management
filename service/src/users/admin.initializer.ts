import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './data/users.repository';

@Injectable()
export class AdminInitializer implements OnModuleInit {
  constructor(private readonly usersRepo: UsersRepository) {}

  async onModuleInit() {
    const existing = await this.usersRepo.findByUsername('admin');
    if (!existing) {
      const password = process.env.ADMIN_PASSWORD || 'admin';
      const hash = bcrypt.hashSync(password, 10);
      await this.usersRepo.create('admin', hash);
    }
  }
}
