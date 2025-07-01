import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SettingsRepository } from './data/settings.repository';
import { UsersRepository } from '../users/data/users.repository';

@Injectable()
export class SettingsService {
  constructor(
    private readonly repo: SettingsRepository,
    private readonly users: UsersRepository,
  ) {}

  async getCostMultiplier(): Promise<number> {
    const setting = await this.repo.findByKey('costMultiplier');
    return setting?.value != null ? Number(setting.value) : 1;
  }

  async setCostMultiplier(value: number): Promise<void> {
    await this.repo.setValue('costMultiplier', value);
  }

  async resetAdminPassword(password: string): Promise<void> {
    const user = await this.users.findByUsername('admin');
    if (user) {
      const hash = bcrypt.hashSync(password, 10);
      await this.users.updatePassword(user._id.toString(), hash);
    }
  }
}
