import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  debug(data: any) {
    console.debug(JSON.stringify(data));
  }

  info(data: any) {
    console.info(JSON.stringify(data));
  }

  warn(data: any) {
    console.warn(JSON.stringify(data));
  }

  error(data: any) {
    console.error(JSON.stringify(data));
  }
}
