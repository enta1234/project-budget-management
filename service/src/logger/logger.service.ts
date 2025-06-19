import { Injectable } from '@nestjs/common';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

@Injectable()
export class LoggerService {
  private output(level: LogLevel, log: any) {
    const msg = JSON.stringify(log);
    switch (level) {
      case 'debug':
        console.debug(msg);
        break;
      case 'info':
        console.info(msg);
        break;
      case 'warn':
        console.warn(msg);
        break;
      case 'error':
        console.error(msg);
        break;
    }
  }

  private log(log_type: 'info' | 'app' | 'service', level: LogLevel, data: any) {
    this.output(level, { log_type, level, ...data });
  }

  logInfo(level: LogLevel, data: any) {
    this.log('info', level, data);
  }

  logApp(level: LogLevel, data: any) {
    this.log('app', level, data);
  }

  logService(level: LogLevel, data: any) {
    this.log('service', level, data);
  }
}
