import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // ─── Security ────────────────────────────────────────────
  app.use(helmet());
  
  // ─── CORS ────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ─── Global Pipes ────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─── API Prefix ──────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ─── Swagger Documentation ───────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('StrokeSync API')
    .setDescription('HIPAA-compliant Mobile Stroke Unit + Remote Neurologist Consultation System')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication & Authorization')
    .addTag('Users', 'User management')
    .addTag('Patients', 'Patient demographics & intake')
    .addTag('Encounters', 'MSU encounter management')
    .addTag('Vitals', 'Vital sign recording')
    .addTag('Labs', 'Lab result management')
    .addTag('Imaging', 'CT/MRI imaging studies')
    .addTag('NIHSS', 'NIHSS stroke assessments')
    .addTag('Consultations', 'Remote neurologist consultations')
    .addTag('Orders', 'Treatment orders')
    .addTag('Messages', 'Real-time messaging')
    .addTag('Alerts', 'Critical event alerts')
    .addTag('Audit', 'HIPAA audit logs')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // ─── Start Server ────────────────────────────────────────
  const port = process.env.BACKEND_PORT || 4000;
  await app.listen(port);
  
  console.log(`\n🧠 StrokeSync API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs\n`);
}

bootstrap();
