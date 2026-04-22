# 🧠 StrokeSync

> **Production-Grade, HIPAA-Compliant Mobile Stroke Unit + Remote Neurologist Consultation System**

StrokeSync is an end-to-end telemetry platform built to bridge the critical time gap in stroke care. By connecting Mobile Stroke Unit (MSU) technicians in the field directly with on-call neurologists via real-time WebSockets, stroke teams can capture, transmit, diagnose, and order life-saving tPA treatments before the patient even arrives at the hospital.

---

## 🏗️ Architecture Stack

**Monorepo:** Turborepo
**Data Layer:** PostgreSQL (RLS / Audit Triggers / pgcrypto) + Prisma ORM
**Backend:** NestJS + Socket.io + Redis Adapter
**Frontend (Web):** Next.js 15 + Tailwind CSS + Shadcn Elements -> Neurologist Dashboard
**Frontend (Mobile):** React Native (Expo) -> Offline-first MSU iPad App
**Shared:** Shared TypeScript interfaces (`@strokesync/shared`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v20+
- PostgreSQL v15+
- Redis Server (for Socket scaling)

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your local PostgreSQL and Redis credentials
# IMPORTANT: Generate a secure 32-byte string for ENCRYPTION_KEY
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup & Seeding
```bash
cd apps/backend
npx prisma migrate dev --name init
npm run seed
```
*(The seed script automatically populates 4 sample stroke patients with complete histories, vitals, imaging, and NIHSS scores).*

### 5. Running the Full Stack
We use Turborepo to orchestrate the monorepo services:
```bash
# Starts Backend (4000), Web (3000/3001), and Mobile Expo Server
npm run dev
```

---

## 💻 The Web Dashboard (`apps/web`)
The Neurologist Command Center. Designed as a pixel-perfect, dark-mode, glassmorphic UI prioritizing high-contrast clinical data.

- **Available At:** `http://localhost:3001/dashboard`
- **Features:** 
  - Real-time Vitals trending charts (Canvas)
  - 15-point NIHSS Component Breakdown visualizer
  - One-tap Consultation Acceptance & tPA Ordering
  - Live Socket.io Chat with the Ambulance

## 📱 The Mobile App (`apps/mobile`)
The Technician's Toolkit. Built for the rigors of the field inside an ambulance.

- **Run via:** `npm run ios` (or scan Expo QR)
- **Features:**
  - **Offline-First:** All forms (Demographics, History, NIHSS) are instantly persisted to `AsyncStorage`. No data loss in dead zones.
  - **Guided Wizard:** Strict tabbed flow replicating clinical protocols.
  - **🚨 Transmit & Alert 🚨:** A single giant button that triggers the API sync and instantly wakes up the Neurologist's dashboard via WebSockets.

## 🗄️ The Backend API & Domain (`apps/backend`)
A modular DDD NestJS application enforcing rigorous clinical logic and compliance.

- **Swagger Docs:** `http://localhost:4000/api/docs`
- **Key Modules:**
  - `alerts`: Transmit & Alert one-tap engine.
  - `nihss`: Pure domain logic for tPA Dose Calculations (0.9mg/kg) & Severity checks.
  - `orders`: Treatment workflow engine.
  - `audit`: Global HIPAA-logging interceptor intercepting all API traffic.
  - `fhir` & `dicom`: Integration ready placeholders for legacy EMR sync.

## 🔒 Security & HIPAA Compliance
1. **At-Rest:** `pgcrypto` encrypts PHI (Names, MRNs, Details) natively in PostgreSQL.
2. **In-Transit:** All endpoints enforce HTTPS.
3. **Auditing:** Immutable PostgreSQL triggers log every change to PHI. Additionally, `AuditInterceptor` captures all `READ` API access.
4. **Access Control:** Role-Based Access Control (`@Roles('NEUROLOGIST')`) ensures Technicians can't place pharmaceutical orders, and Neurologists can't inject field vitals.

## 🧪 E2E Demonstration
Run the simulated workflow script to see the architectural connections:
```bash
./tools/e2e-demo.sh
```

---
*Built for the Google Advanced Agentic Coding capability.* 🚀