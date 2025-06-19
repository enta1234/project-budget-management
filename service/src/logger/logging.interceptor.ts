import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, originalUrl: url } = req;
    const start = Date.now();
    this.logger.logInfo('debug', { event: 'request_received', method, url });
    return next.handle().pipe(
      tap((data) => {
        const process_time = Date.now() - start;
        const log = {
          event: 'request_completed',
          method,
          url,
          status_code: res.statusCode,
          process_time,
        };
        if (res.statusCode >= 500) this.logger.logInfo('error', log);
        else if (res.statusCode >= 400) this.logger.logInfo('warn', log);
        else this.logger.logInfo('info', log);
      }),
      catchError((err) => {
        const process_time = Date.now() - start;
        this.logger.logInfo('error', {
          event: 'request_failed',
          method,
          url,
          status_code: res.statusCode,
          process_time,
          error: err.message,
        });
        throw err;
      })
    );
  }
}
