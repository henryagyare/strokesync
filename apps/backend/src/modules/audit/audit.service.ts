import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    userId?: string;
    action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'EXPORT' | 'PRINT' | 'ACCESS_DENIED' | 'PHI_ACCESS' | 'PHI_MODIFY';
    resource: 'USER' | 'PATIENT' | 'ENCOUNTER' | 'VITAL_SIGN' | 'LAB_RESULT' | 'IMAGING' | 'NIHSS' | 'CONSULTATION' | 'TREATMENT_ORDER' | 'MESSAGE' | 'ALERT' | 'AUTH';
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
    oldValues?: Record<string, unknown>;
    newValues?: Record<string, unknown>;
    phiAccessed?: boolean;
    description?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        oldValues: params.oldValues as any,
        newValues: params.newValues as any,
        phiAccessed: params.phiAccessed ?? false,
        description: params.description,
      },
    });
  }

  async findAll(params?: {
    userId?: string;
    action?: string;
    resource?: string;
    phiOnly?: boolean;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    if (params?.userId) where.userId = params.userId;
    if (params?.action) where.action = params.action;
    if (params?.resource) where.resource = params.resource;
    if (params?.phiOnly) where.phiAccessed = true;
    if (params?.startDate || params?.endDate) {
      where.createdAt = {};
      if (params?.startDate) where.createdAt.gte = params.startDate;
      if (params?.endDate) where.createdAt.lte = params.endDate;
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, role: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: params?.limit ?? 50,
        skip: params?.offset ?? 0,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, total, limit: params?.limit ?? 50, offset: params?.offset ?? 0 };
  }
}
