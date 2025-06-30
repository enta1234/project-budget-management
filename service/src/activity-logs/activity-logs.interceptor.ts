import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ActivityLogsService } from './activity-logs.service';
import { getActivityDescription } from './activity.constants';

@Injectable()
export class ActivityLogsInterceptor implements NestInterceptor {
  constructor(private readonly logsService: ActivityLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, originalUrl: url, body } = req;
    if (method === 'GET') return next.handle();
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const processTime = Date.now() - start;
        const { name, detail } = getActivityDescription(method, url);
        this.logsService.create({
          method,
          url,
          body,
          statusCode: res.statusCode,
          processTime,
          name,
          detail,
        });
      }),
      catchError(err => {
        const processTime = Date.now() - start;
        const { name, detail } = getActivityDescription(method, url);
        this.logsService.create({
          method,
          url,
          body,
          statusCode: res.statusCode,
          processTime,
          name,
          detail,
        });
        throw err;
      }),
    );
  }
}
