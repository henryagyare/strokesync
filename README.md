# StrokeSync

> HIPAA-compliant Mobile Stroke Unit + Remote Neurologist Consultation System

A production-grade real-time telemedicine platform connecting mobile stroke unit technicians with remote neurologists for rapid stroke assessment and treatment coordination.

## 🏗️ Architecture

**Turborepo Monorepo** with the following packages:

| Package | Tech | Description |
|---------|------|-------------|
| `apps/backend` | NestJS + Prisma + Socket.io | REST API + WebSocket gateway |
| `apps/web` | Next.js 15 + Tailwind + shadcn/ui | Neurologist consultation dashboard |
| `apps/mobile` | React Native (Expo) | Technician mobile app |
| `packages/shared` | TypeScript | Domain types, constants, utilities |
| `packages/ui` | React | Shared UI components |

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Start PostgreSQL & Redis (via Docker or local)
# 4. Generate Prisma client & run migrations
npm run db:generate
npm run db:migrate

# 5. Seed sample patients
npm run db:seed

# 6. Start all apps in dev mode
npm run dev
```

## 📦 Sample Patients (Preloaded)

| Patient | Demographics | Condition | Treatment |
|---------|-------------|-----------|-----------|
| John Doe | 65M | Large right MCA infarct | tPA + ICU |
| Jane Smith | 50F | Small left PCA infarct | tPA + Speech therapy |
| Bob Johnson | 70M | Large left MCA infarct | Pending review |
| Maria Rodriguez | 40F | Small right frontal hemorrhage | Intake |

## 🔐 Demo Credentials

- **Technician:** `tech@strokesync.com` / `StrokeSync2024!`
- **Neurologist:** `neuro@strokesync.com` / `StrokeSync2024!`
- **Admin:** `admin@strokesync.com` / `StrokeSync2024!`

## 🛡️ HIPAA Compliance

- AES-256 column-level PHI encryption
- Full audit logging on every data access
- JWT + RBAC authentication
- Refresh token rotation
- Rate limiting