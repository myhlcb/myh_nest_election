import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();

    const method = req.method;
    const url = req.url;
    const body = req.body;

    console.log(`➡️ ${method} ${url} - body: ${JSON.stringify(body)}`);

    return next
      .handle()
      .pipe(
        tap((data) =>
          console.log(
            `⬅️ ${method} ${url} - ${Date.now() - now}ms - result: ${JSON.stringify(data)}`,
          ),
        ),
      );
  }
}
