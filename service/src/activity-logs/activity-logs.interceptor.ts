import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ActivityLogsService } from './activity-logs.service';

@Injectable()
export class ActivityLogsInterceptor implements NestInterceptor {
  constructor(private readonly logsService: ActivityLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, originalUrl: url, body } = req;
    if (method === 'GET') return next.handle();
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const processTime = Date.now() - start;
        this.logsService.create({
          method,
          url,
          body,
          statusCode: res.statusCode,
          processTime,
        });
      }),
      catchError(err => {
        const processTime = Date.now() - start;
        this.logsService.create({
          method,
          url,
          body,
          statusCode: res.statusCode,
          processTime,
        });
        throw err;
      }),
    );
  }
}
