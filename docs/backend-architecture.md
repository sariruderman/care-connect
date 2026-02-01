# Backend Architecture Guide

## Overview

מערכת שרת מודולרית ל-Node.js לחיבור הורים לבייביסיטריות, תומכת גם באתר וגם במערכת טלפונית (IVR/AI).

## Quick Start

```bash
# 1. Clone your backend repository
git clone <your-backend-repo>

# 2. Install dependencies
npm install

# 3. Setup database
npm run db:migrate

# 4. Start development server
npm run dev
```

## Technology Stack (Recommended)

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (LTS) |
| Framework | Express / NestJS |
| Database | PostgreSQL |
| ORM | Prisma / TypeORM |
| Auth | OTP + JWT |
| API Style | REST |

## Project Structure

```
backend/
├── src/
│   ├── controllers/          # HTTP request handlers (thin)
│   │   ├── auth.controller.ts
│   │   ├── parents.controller.ts
│   │   ├── babysitters.controller.ts
│   │   ├── guardians.controller.ts
│   │   ├── jobs.controller.ts
│   │   ├── bookings.controller.ts
│   │   ├── locations.controller.ts
│   │   └── telephony.controller.ts
│   │
│   ├── services/             # Business logic (all rules here)
│   │   ├── auth.service.ts
│   │   ├── matching.service.ts
│   │   ├── notification.service.ts
│   │   ├── guardian.service.ts
│   │   ├── telephony.service.ts
│   │   └── location.service.ts
│   │
│   ├── repositories/         # Data access layer
│   │   ├── user.repository.ts
│   │   ├── parent.repository.ts
│   │   ├── babysitter.repository.ts
│   │   ├── job.repository.ts
│   │   └── booking.repository.ts
│   │
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── rate-limit.middleware.ts
│   │
│   ├── models/               # Database models
│   │   └── (Prisma schema or TypeORM entities)
│   │
│   ├── routes/               # Route definitions
│   │   └── index.ts
│   │
│   ├── utils/                # Helpers
│   │   ├── jwt.ts
│   │   ├── otp.ts
│   │   └── validators.ts
│   │
│   └── config/               # Configuration
│       ├── database.ts
│       └── env.ts
│
├── prisma/                   # If using Prisma
│   └── schema.prisma
│
├── tests/                    # Unit & integration tests
│
└── docs/
    └── api-specification.yaml
```

## Database Schema (Prisma Example)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  PARENT
  BABYSITTER
  GUARDIAN
  ADMIN
}

enum UserStatus {
  PENDING
  ACTIVE
  SUSPENDED
  DELETED
}

enum ApprovalMode {
  AUTO_APPROVE
  APPROVE_EACH_REQUEST
  APPROVE_NEW_FAMILIES
}

enum RequestStatus {
  NEW
  MATCHING
  PENDING_RESPONSES
  PENDING_SELECTION
  PENDING_PAYMENT
  CONFIRMED
  COMPLETED
  CANCELLED
}

enum BookingStatus {
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  REFUNDED
  FAILED
}

enum CandidateCallStatus {
  PENDING
  CALLING
  COMPLETED
  NO_ANSWER
  FAILED
}

enum CandidateResponse {
  PENDING
  INTERESTED
  DECLINED
  GUARDIAN_PENDING
  GUARDIAN_APPROVED
  GUARDIAN_DECLINED
}

model User {
  id        String     @id @default(uuid())
  phone     String     @unique
  email     String?
  role      UserRole
  status    UserStatus @default(PENDING)
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")

  parentProfile     ParentProfile?
  babysitterProfile BabysitterProfile?
  guardianProfile   GuardianProfile?

  @@map("users")
}

model City {
  id            String         @id @default(uuid())
  name          String         @unique
  neighborhoods Neighborhood[]

  @@map("cities")
}

model Neighborhood {
  id     String @id @default(uuid())
  name   String
  cityId String @map("city_id")
  city   City   @relation(fields: [cityId], references: [id])

  @@unique([cityId, name])
  @@map("neighborhoods")
}

model CommunityStyle {
  id          String  @id @default(uuid())
  label       String  @unique
  description String?
  active      Boolean @default(true)

  @@map("community_styles")
}

model ParentProfile {
  id               String   @id @default(uuid())
  userId           String   @unique @map("user_id")
  fullName         String   @map("full_name")
  address          String
  city             String
  area             String
  childrenAges     Int[]    @map("children_ages")
  householdNotes   String?  @map("household_notes")
  communityStyleId String?  @map("community_style_id")
  languages        String[] @default([])
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  requests Request[]
  bookings Booking[]

  @@map("parent_profiles")
}

model BabysitterProfile {
  id                       String       @id @default(uuid())
  userId                   String       @unique @map("user_id")
  fullName                 String       @map("full_name")
  age                      Int
  serviceAreas             String[]     @map("service_areas")
  availability             Json         @default("[]")
  experienceYears          Int          @map("experience_years")
  communityStyleId         String?      @map("community_style_id")
  guardianId               String?      @map("guardian_id")
  guardianRequiredApproval Boolean      @default(false) @map("guardian_required_approval")
  approvalMode             ApprovalMode @default(APPROVE_EACH_REQUEST) @map("approval_mode")
  rating                   Float        @default(0)
  totalReviews             Int          @default(0) @map("total_reviews")
  bio                      String?
  languages                String[]     @default([])
  createdAt                DateTime     @default(now()) @map("created_at")
  updatedAt                DateTime     @updatedAt @map("updated_at")

  user       User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  guardian   GuardianProfile?  @relation(fields: [guardianId], references: [id])
  candidates RequestCandidate[]
  bookings   Booking[]

  @@map("babysitter_profiles")
}

model GuardianProfile {
  id               String   @id @default(uuid())
  userId           String   @unique @map("user_id")
  fullName         String   @map("full_name")
  phone            String
  preferredChannel String   @default("BOTH") @map("preferred_channel")
  verified         Boolean  @default(false)
  createdAt        DateTime @default(now()) @map("created_at")

  user        User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  babysitters BabysitterProfile[]

  @@map("guardian_profiles")
}

model Request {
  id               String        @id @default(uuid())
  parentId         String        @map("parent_id")
  datetimeStart    DateTime      @map("datetime_start")
  datetimeEnd      DateTime      @map("datetime_end")
  area             String
  address          String?
  childrenAges     Int[]         @map("children_ages")
  requirements     String?
  minBabysitterAge Int?          @map("min_babysitter_age")
  maxBabysitterAge Int?          @map("max_babysitter_age")
  communityStyleId String?       @map("community_style_id")
  status           RequestStatus @default(NEW)
  createdAt        DateTime      @default(now()) @map("created_at")
  updatedAt        DateTime      @updatedAt @map("updated_at")

  parent     ParentProfile      @relation(fields: [parentId], references: [id])
  candidates RequestCandidate[]
  booking    Booking?

  @@map("requests")
}

model RequestCandidate {
  id                   String              @id @default(uuid())
  requestId            String              @map("request_id")
  babysitterId         String              @map("babysitter_id")
  callStatus           CandidateCallStatus @default(PENDING) @map("call_status")
  callAttempts         Int                 @default(0) @map("call_attempts")
  response             CandidateResponse   @default(PENDING)
  babysitterRespondedAt DateTime?          @map("babysitter_responded_at")
  guardianRespondedAt  DateTime?           @map("guardian_responded_at")
  createdAt            DateTime            @default(now()) @map("created_at")

  request    Request           @relation(fields: [requestId], references: [id])
  babysitter BabysitterProfile @relation(fields: [babysitterId], references: [id])

  @@unique([requestId, babysitterId])
  @@map("request_candidates")
}

model Booking {
  id              String        @id @default(uuid())
  requestId       String        @unique @map("request_id")
  parentId        String        @map("parent_id")
  babysitterId    String        @map("babysitter_id")
  datetimeStart   DateTime      @map("datetime_start")
  datetimeEnd     DateTime      @map("datetime_end")
  address         String
  status          BookingStatus @default(CONFIRMED)
  paymentStatus   PaymentStatus @default(PENDING) @map("payment_status")
  paymentAmount   Float?        @map("payment_amount")
  confirmedAt     DateTime      @default(now()) @map("confirmed_at")
  startedAt       DateTime?     @map("started_at")
  completedAt     DateTime?     @map("completed_at")
  parentRating    Int?          @map("parent_rating")
  parentReview    String?       @map("parent_review")
  babysitterRating Int?         @map("babysitter_rating")
  createdAt       DateTime      @default(now()) @map("created_at")

  request    Request           @relation(fields: [requestId], references: [id])
  parent     ParentProfile     @relation(fields: [parentId], references: [id])
  babysitter BabysitterProfile @relation(fields: [babysitterId], references: [id])

  @@map("bookings")
}

model OtpVerification {
  id        String   @id @default(uuid())
  phone     String
  code      String
  expiresAt DateTime @map("expires_at")
  verified  Boolean  @default(false)
  createdAt DateTime @default(now()) @map("created_at")

  @@index([phone, code])
  @@map("otp_verifications")
}

model TelephonySession {
  id          String   @id @default(uuid())
  callId      String   @unique @map("call_id")
  phone       String
  sessionData Json     @default("{}") @map("session_data")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("telephony_sessions")
}
```

## Service Layer Examples

### AuthService

```typescript
// src/services/auth.service.ts
import { generateOtp, verifyOtp } from '../utils/otp';
import { signJwt } from '../utils/jwt';

export class AuthService {
  async sendOtp(phone: string): Promise<{ expiresIn: number }> {
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    await this.otpRepository.create({ phone, code, expiresAt });
    await this.smsService.send(phone, `קוד האימות שלך: ${code}`);
    
    return { expiresIn: 300 };
  }

  async verifyOtp(phone: string, code: string): Promise<{ token: string; user: User }> {
    const otp = await this.otpRepository.findValid(phone, code);
    if (!otp) throw new UnauthorizedError('Invalid or expired OTP');
    
    let user = await this.userRepository.findByPhone(phone);
    if (!user) {
      // First time login - user needs to register
      throw new NotFoundError('User not found. Please register first.');
    }
    
    const token = signJwt({ userId: user.id, role: user.role });
    return { token, user };
  }
}
```

### MatchingService

```typescript
// src/services/matching.service.ts
export class MatchingService {
  async findCandidates(requestId: string): Promise<number> {
    const request = await this.requestRepository.findById(requestId);
    if (!request) throw new NotFoundError('Request not found');

    // Find matching babysitters
    const candidates = await this.babysitterRepository.findMatching({
      area: request.area,
      datetimeStart: request.datetimeStart,
      datetimeEnd: request.datetimeEnd,
      minAge: request.minBabysitterAge,
      maxAge: request.maxBabysitterAge,
      communityStyleId: request.communityStyleId,
    });

    // Create candidate records
    for (const babysitter of candidates) {
      await this.candidateRepository.create({
        requestId,
        babysitterId: babysitter.id,
      });
    }

    // Update request status
    await this.requestRepository.update(requestId, { 
      status: 'MATCHING' 
    });

    // Trigger IVR calls
    await this.telephonyService.initiateCallsForRequest(requestId);

    return candidates.length;
  }
}
```

### GuardianService

```typescript
// src/services/guardian.service.ts
export class GuardianService {
  async approveRequest(guardianId: string, candidateId: string) {
    const guardian = await this.guardianRepository.findById(guardianId);
    const candidate = await this.candidateRepository.findById(candidateId);
    
    // Verify guardian owns this babysitter
    if (candidate.babysitter.guardianId !== guardianId) {
      throw new ForbiddenError('Not authorized');
    }
    
    await this.candidateRepository.update(candidateId, {
      response: 'GUARDIAN_APPROVED',
      guardianRespondedAt: new Date(),
    });

    // Notify parent
    await this.notificationService.notifyParentOfAvailableCandidate(
      candidate.request.parentId,
      candidate
    );

    return candidate;
  }
}
```

## API Integration

### Frontend Configuration

The frontend is already configured to use your backend. Update the API URL:

```typescript
// Frontend: src/services/api.ts
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
};
```

Set environment variable in production:
```
VITE_API_URL=https://your-backend-domain.com/api
```

### Response Format

All API responses must follow this format:

```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Error message"
}

// Paginated
{
  "success": true,
  "data": {
    "data": [...],
    "total": 100,
    "page": 1,
    "per_page": 10,
    "total_pages": 10
  }
}
```

## Telephony Integration

The system supports IVR/AI integration via webhooks:

```
POST /telephony/incoming-call    → Handle incoming call
POST /telephony/collect-input    → Process DTMF input
POST /telephony/complete-job     → Finalize phone-based job
```

### IVR Flow

1. **Babysitter receives call** with job details
2. **Press 1** = Interested, **Press 2** = Decline
3. If babysitter interested AND has guardian:
   - System calls guardian
   - Guardian **Press 1** = Approve, **Press 2** = Decline
4. If approved → Candidate marked as available for parent selection

## Security Checklist

- [ ] Rate limiting on OTP endpoints
- [ ] JWT token expiration (recommended: 7 days)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (use ORM)
- [ ] CORS configuration
- [ ] Helmet.js for security headers
- [ ] API versioning support
- [ ] Request logging
- [ ] Error handling without exposing internals

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/babysitter_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# SMS Provider (Twilio, MessageBird, etc.)
SMS_PROVIDER=twilio
SMS_API_KEY=your-api-key
SMS_FROM_NUMBER=+972...

# Telephony Provider (for IVR)
TELEPHONY_WEBHOOK_SECRET=your-webhook-secret

# Server
PORT=3001
NODE_ENV=development
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.service.test.ts
```

## Deployment

```bash
# Build
npm run build

# Start production
npm start

# With PM2
pm2 start dist/index.js --name babysitter-api
```

## API Documentation

Import `docs/api-specification.yaml` into:
- **Swagger UI**: https://editor.swagger.io
- **Postman**: Import OpenAPI spec
- **Insomnia**: Import OpenAPI spec

Generate client SDKs:
```bash
npx openapi-generator-cli generate -i docs/api-specification.yaml -g typescript-fetch -o ./generated-client
```
