import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HIPAA-Audit');

  constructor(private readonly auditService: AuditService) {}

  private resolveResource(path: string): 'PATIENT' | 'ENCOUNTER' | 'AUTH' {
    if (path.includes('/patients')) {
      return 'PATIENT';
    }

    if (path.includes('/encounters')) {
      return 'ENCOUNTER';
    }

    return 'AUTH';
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = (req as any).user;
    const path = req.url;
    const method = req.method;
    const resource = this.resolveResource(path);

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        if (user && path.includes('/api/v1')) {
          // Log specific PHI access endpoints globally if not caught by services
          if (method === 'GET' && (path.includes('/patients') || path.includes('/encounters'))) {
            this.auditService.log({
              userId: user.id,
              action: 'READ',
              resource,
              description: `Viewed ${path} (${duration}ms)`,
              phiAccessed: true,
            }).catch(e => this.logger.error(`Failed to write audit log: ${e.message}`));
          }
        }
      }),
      catchError((error) => {
        if (user) {
          this.auditService.log({
            userId: user.id,
            action: 'ACCESS_DENIED',
            resource,
            description: `Error on ${method} ${path}: ${error.message}`,
            phiAccessed: false,
          }).catch(e => this.logger.error(`Failed to write audit log: ${e.message}`));
        }
        throw error;
      }),
    );
  }
}
