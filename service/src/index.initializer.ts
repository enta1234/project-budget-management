import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class IndexInitializer implements OnModuleInit {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly logger: LoggerService,
  ) {}

  async onModuleInit() {
    for (const name of this.connection.modelNames()) {
      try {
        await this.connection.model(name).createIndexes();
        this.logger.logApp('info', { msg: `indexes ensured for ${name}` });
      } catch (err: any) {
        this.logger.logApp('error', {
          msg: `failed to create indexes for ${name}`,
          error: err.message,
        });
      }
    }
  }
}
