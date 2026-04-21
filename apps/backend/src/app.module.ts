import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { EncountersModule } from './modules/encounters/encounters.module';
import { VitalsModule } from './modules/vitals/vitals.module';
import { LabsModule } from './modules/labs/labs.module';
import { ImagingModule } from './modules/imaging/imaging.module';
import { NihssModule } from './modules/nihss/nihss.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { AuditModule } from './modules/audit/audit.module';
import { SocketModule } from './modules/socket/socket.module';

@Module({
  imports: [
    // ─── Configuration ───────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // ─── Core Modules ────────────────────────────────────────
    PrismaModule,
    SocketModule,

    // ─── Feature Modules ─────────────────────────────────────
    AuthModule,
    UsersModule,
    PatientsModule,
    EncountersModule,
    VitalsModule,
    LabsModule,
    ImagingModule,
    NihssModule,
    ConsultationsModule,
    OrdersModule,
    AlertsModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
