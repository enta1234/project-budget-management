import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  async getSettings() {
    const costMultiplier = await this.service.getCostMultiplier();
    return { costMultiplier };
  }

  @Patch('costMultiplier')
  setCost(@Body() body: { value: number }) {
    return this.service.setCostMultiplier(body.value);
  }

  @Post('reset-admin')
  resetAdmin(@Body() body: { password: string }) {
    return this.service.resetAdminPassword(body.password);
  }
}
