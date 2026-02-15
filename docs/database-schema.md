# 📊 סכמת מסד נתונים מלאה – מערכת חיבור הורים לבייביסיטריות

> מסמך זה מתאר את כל הישויות, התכונות, והקשרים הנדרשים לבניית השרת.
> מבוסס על הפרונטאנד הקיים, ה-API spec, והאפיון העסקי.

---

## 📋 תוכן עניינים

1. [סקירת ישויות](#סקירת-ישויות)
2. [טבלאות מפורטות](#טבלאות-מפורטות)
3. [Enums](#enums)
4. [קשרים בין טבלאות (ERD)](#קשרים-בין-טבלאות)
5. [אינדקסים מומלצים](#אינדקסים-מומלצים)
6. [Prisma Schema מלא](#prisma-schema-מלא)
7. [SQL DDL](#sql-ddl)

---

## סקירת ישויות

| # | טבלה | תיאור | קשרים עיקריים |
|---|-------|--------|---------------|
| 1 | `users` | משתמש מערכת (הורה/בייביסיטרית/אפוטרופוס/מנהל) | → profiles, roles |
| 2 | `user_roles` | תפקידי משתמש (נפרד מ-users לאבטחה!) | → users |
| 3 | `parent_profiles` | פרופיל הורה | → users, cities, neighborhoods, community_styles |
| 4 | `babysitter_profiles` | פרופיל בייביסיטרית | → users, cities, neighborhoods, community_styles, guardian_profiles |
| 5 | `guardian_profiles` | פרופיל אפוטרופוס (הורה של בייביסיטרית) | → users, babysitter_profiles |
| 6 | `cities` | ערים | → neighborhoods |
| 7 | `neighborhoods` | שכונות | → cities |
| 8 | `community_styles` | סגנון קהילה (מנוהל ע"י מנהל) | → parent_profiles, babysitter_profiles |
| 9 | `job_requests` | בקשת שמרטפות מהורה | → parent_profiles, cities, neighborhoods |
| 10 | `request_candidates` | מועמדות בייביסיטרית לבקשה | → job_requests, babysitter_profiles |
| 11 | `bookings` | הזמנה מאושרת | → job_requests, parent_profiles, babysitter_profiles |
| 12 | `otp_verifications` | קודי אימות טלפוני | — |
| 13 | `telephony_sessions` | שיחות טלפוניות (IVR/AI) | — |
| 14 | `notifications` | התראות (SMS/שיחה/WhatsApp) | → users |

---

## טבלאות מפורטות

### 1. `users` – משתמשים

| שדה | סוג | חובה | ברירת מחדל | תיאור |
|-----|------|------|-----------|--------|
| `id` | UUID | ✅ | auto-generate | מזהה ייחודי |
| `phone` | VARCHAR(20) | ✅ | — | מספר טלפון (unique) |
| `email` | VARCHAR(255) | ❌ | NULL | אימייל אופציונלי |
| `is_verified` | BOOLEAN | ✅ | false | האם עבר אימות טלפוני |
| `status` | ENUM(UserStatus) | ✅ | 'PENDING' | סטטוס חשבון |
| `created_at` | TIMESTAMP | ✅ | now() | תאריך יצירה |
| `updated_at` | TIMESTAMP | ✅ | now() | תאריך עדכון |

**אילוצים:** `phone` – UNIQUE

> ⚠️ **חשוב:** אין שדה `role` בטבלת users! התפקידים נשמרים בטבלה נפרדת `user_roles` למניעת privilege escalation.

---

### 2. `user_roles` – תפקידי משתמש

| שדה | סוג | חובה | ברירת מחדל | תיאור |
|-----|------|------|-----------|--------|
| `id` | UUID | ✅ | auto-generate | מזהה |
| `user_id` | UUID (FK → users) | ✅ | — | משתמש |
| `role` | ENUM(AppRole) | ✅ | — | תפקיד |

**אילוצים:** UNIQUE(user_id, role)

> משתמש יכול להחזיק מספר תפקידים (למשל הורה וגם אפוטרופוס).

---

### 3. `parent_profiles` – פרופילי הורים

| שדה | סוג | חובה | ברירת מחדל | תיאור |
|-----|------|------|-----------|--------|
| `id` | UUID | ✅ | auto-generate | מזהה |
| `user_id` | UUID (FK → users) | ✅ | — | UNIQUE – קשר 1:1 |
| `full_name` | VARCHAR(100) | ✅ | — | שם מלא |
| `address` | VARCHAR(255) | ✅ | — | כתובת מלאה |
| `city_id` | UUID (FK → cities) | ✅ | — | עיר |
| `neighborhood_id` | UUID (FK → neighborhoods) | ✅ | — | שכונה |
| `children_ages` | INT[] | ✅ | — | גילאי ילדים |
| `household_notes` | TEXT | ❌ | NULL | הערות (מבוגרים נוספים, חיות מחמד) |
| `community_style_id` | UUID (FK → community_styles) | ❌ | NULL | סגנון קהילה |
| `languages` | VARCHAR[] | ❌ | [] | שפות מדוברות |
| `created_at` | TIMESTAMP | ✅ | now() | — |
| `updated_at` | TIMESTAMP | ✅ | now() | — |

**אילוצים:** `user_id` – UNIQUE

---

### 4. `babysitter_profiles` – פרופילי בייביסיטריות

| שדה | סוג | חובה | ברירת מחדל | תיאור |
|-----|------|------|-----------|--------|
| `id` | UUID | ✅ | auto-generate | מזהה |
| `user_id` | UUID (FK → users) | ✅ | — | UNIQUE – קשר 1:1 |
| `full_name` | VARCHAR(100) | ✅ | — | שם מלא |
| `age` | INT | ✅ | — | גיל |
| `city_id` | UUID (FK → cities) | ✅ | — | עיר מגורים |
| `neighborhood_id` | UUID (FK → neighborhoods) | ✅ | — | שכונה |
| `walking_radius_km` | FLOAT | ✅ | 2.0 | רדיוס הליכה בק"מ |
| `service_areas` | VARCHAR[] | ❌ | [] | אזורי שירות נוספים (שמות שכונות/ערים) |
| `availability` | JSONB | ✅ | '[]' | זמינות (מערך AvailabilitySlot) |
| `experience_years` | INT | ✅ | 0 | שנות ניסיון |
| `community_style_id` | UUID (FK → community_styles) | ❌ | NULL | סגנון קהילה |
| `guardian_id` | UUID (FK → guardian_profiles) | ❌ | NULL | אפוטרופוס מקושר |
| `guardian_required_approval` | BOOLEAN | ✅ | false | האם נדרש אישור אפוטרופוס |
| `approval_mode` | ENUM(ApprovalMode) | ✅ | 'APPROVE_EACH_REQUEST' | מצב אישור |
| `rating` | FLOAT | ✅ | 0 | דירוג ממוצע |
| `total_reviews` | INT | ✅ | 0 | סה"כ ביקורות |
| `bio` | TEXT | ❌ | NULL | תיאור עצמי |
| `languages` | VARCHAR[] | ❌ | [] | שפות מדוברות |
| `created_at` | TIMESTAMP | ✅ | now() | — |
| `updated_at` | TIMESTAMP | ✅ | now() | — |

**אילוצים:** `user_id` – UNIQUE

**מבנה AvailabilitySlot (JSONB):**
```json
{
  "day_of_week": 0,     // 0=ראשון ... 6=שבת
  "start_time": "16:00", // HH:mm
  "end_time": "22:00"    // HH:mm
}
```

---

### 5. `guardian_profiles` – אפוטרופוסים (הורי בייביסיטריות)

| שדה | סוג | חובה | ברירת מחדל | תיאור |
|-----|------|------|-----------|--------|
| `id` | UUID | ✅ | auto-generate | מזהה |
| `user_id` | UUID (FK → users) | ✅ | — | UNIQUE – קשר 1:1 |
| `full_name` | VARCHAR(100) | ✅ | — | שם מלא |
| `phone` | VARCHAR(20) | ✅ | — | טלפון ליצירת קשר |
| `preferred_channel` | ENUM('PHONE','WEB','BOTH') | ✅ | 'BOTH' | ערוץ תקשורת מועדף |
| `approval_level` | ENUM('VIEW_ONLY','FULL_CONTROL') | ✅ | 'FULL_CONTROL' | רמת הרשאה |
| `verified` | BOOLEAN | ✅ | false | האם אומת |
| `created_at` | TIMESTAMP | ✅ | now() | — |

**אילוצים:** `user_id` – UNIQUE

---

### 6. `cities` – ערים

| שדה | סוג | חובה | ברירת מחדל | תיאור |
|-----|------|------|-----------|--------|
| `id` | UUID | ✅ | auto-generate | מזהה |
| `name` | VARCHAR(100) | ✅ | — | שם העיר |

**אילוצים:** `name` – UNIQUE

---

### 7. `neighborhoods` – שכונות

| שדה | סוג | חובה | ברירת מחדל | תיאור |
|-----|------|------|-----------|--------|
| `id` | UUID | ✅ | auto-generate | מזהה |
| `city_id` | UUID (FK → cities) | ✅ | — | עיר |
| `name` | VARCHAR(100) | ✅ | — | שם השכונה |

**אילוצים:** UNIQUE(city_id, name)

---

### 8. `community_styles` – סגנונות קהילה

| שדה | סוג | חובה | ברירת מחדל | תיאור |
|-----|------|------|-----------|--------|
| `id` | UUID | ✅ | auto-generate | מזהה |
| `label` | VARCHAR(50) | ✅ | — | תווית (ספרדי, ליטאי...) |
| `description` | TEXT | ❌ | NULL | תיאור |
| `active` | BOOLEAN | ✅ | true | האם פעיל |

**אילוצים:** `label` – UNIQUE

---

### 9. `job_requests` – בקשות שמרטפות

| שדה | סוג | חובה | ברירת מחדל | תיאור |
|-----|------|------|-----------|--------|
| `id` | UUID | ✅ | auto-generate | מזהה |
| `parent_id` | UUID (FK → parent_profiles) | ✅ | — | הורה מבקש |
| `city_id` | UUID (FK → cities) | ✅ | — | עיר |
| `neighborhood_id` | UUID (FK → neighborhoods) | ✅ | — | שכונה |
| `address` | VARCHAR(255) | ❌ | NULL | כתובת מדויקת |
| `datetime_start` | TIMESTAMP | ✅ | — | תחילת שמירה |
| `datetime_end` | TIMESTAMP | ✅ | — | סיום שמירה |
| `children_ages` | INT[] | ✅ | — | גילאי הילדים |
| `requirements` | TEXT | ❌ | NULL | דרישות מיוחדות |
| `min_babysitter_age` | INT | ❌ | NULL | גיל מינימלי לבייביסיטרית |
| `max_babysitter_age` | INT | ❌ | NULL | גיל מקסימלי |
| `community_style_id` | UUID (FK → community_styles) | ❌ | NULL | העדפת סגנון קהילה |
| `status` | ENUM(RequestStatus) | ✅ | 'NEW' | סטטוס |
| `created_at` | TIMESTAMP | ✅ | now() | — |
| `updated_at` | TIMESTAMP | ✅ | now() | — |

---

### 10. `request_candidates` – מועמדות לבקשה

| שדה | סוג | חובה | ברירת מחדל | תיאור |
|-----|------|------|-----------|--------|
| `id` | UUID | ✅ | auto-generate | מזהה |
| `request_id` | UUID (FK → job_requests) | ✅ | — | בקשה |
| `babysitter_id` | UUID (FK → babysitter_profiles) | ✅ | — | בייביסיטרית |
| `call_status` | ENUM(CandidateCallStatus) | ✅ | 'PENDING' | סטטוס שיחה |
| `call_attempts` | INT | ✅ | 0 | מספר ניסיונות חיוג |
| `response` | ENUM(CandidateResponse) | ✅ | 'PENDING' | תגובת מועמדת |
| `babysitter_responded_at` | TIMESTAMP | ❌ | NULL | מועד תגובת בייביסיטרית |
| `guardian_responded_at` | TIMESTAMP | ❌ | NULL | מועד תגובת אפוטרופוס |
| `created_at` | TIMESTAMP | ✅ | now() | — |

**אילוצים:** UNIQUE(request_id, babysitter_id)

---

### 11. `bookings` – הזמנות מאושרות

| שדה | סוג | חובה | ברירת מחדל | תיאור |
|-----|------|------|-----------|--------|
| `id` | UUID | ✅ | auto-generate | מזהה |
| `request_id` | UUID (FK → job_requests) | ✅ | — | UNIQUE – בקשה מקורית |
| `parent_id` | UUID (FK → parent_profiles) | ✅ | — | הורה |
| `babysitter_id` | UUID (FK → babysitter_profiles) | ✅ | — | בייביסיטרית |
| `datetime_start` | TIMESTAMP | ✅ | — | תחילה |
| `datetime_end` | TIMESTAMP | ✅ | — | סיום |
| `address` | VARCHAR(255) | ✅ | — | כתובת |
| `status` | ENUM(BookingStatus) | ✅ | 'CONFIRMED' | סטטוס |
| `payment_status` | ENUM(PaymentStatus) | ✅ | 'PENDING' | סטטוס תשלום |
| `payment_amount` | DECIMAL(10,2) | ❌ | NULL | סכום |
| `confirmed_at` | TIMESTAMP | ✅ | now() | מועד אישור |
| `started_at` | TIMESTAMP | ❌ | NULL | מועד התחלה בפועל |
| `completed_at` | TIMESTAMP | ❌ | NULL | מועד סיום בפועל |
| `parent_rating` | INT (1-5) | ❌ | NULL | דירוג ההורה לבייביסיטרית |
| `parent_review` | TEXT | ❌ | NULL | ביקורת טקסט |
| `babysitter_rating` | INT (1-5) | ❌ | NULL | דירוג הבייביסיטרית להורה |
| `created_at` | TIMESTAMP | ✅ | now() | — |

**אילוצים:** `request_id` – UNIQUE (הזמנה אחת לכל בקשה)

---

### 12. `otp_verifications` – אימות OTP

| שדה | סוג | חובה | ברירת מחדל | תיאור |
|-----|------|------|-----------|--------|
| `id` | UUID | ✅ | auto-generate | מזהה |
| `phone` | VARCHAR(20) | ✅ | — | טלפון |
| `code` | VARCHAR(6) | ✅ | — | קוד |
| `expires_at` | TIMESTAMP | ✅ | — | תוקף |
| `verified` | BOOLEAN | ✅ | false | אומת? |
| `created_at` | TIMESTAMP | ✅ | now() | — |

**אינדקס:** INDEX(phone, code)

---

### 13. `telephony_sessions` – שיחות טלפוניות

| שדה | סוג | חובה | ברירת מחדל | תיאור |
|-----|------|------|-----------|--------|
| `id` | UUID | ✅ | auto-generate | מזהה |
| `call_id` | VARCHAR(100) | ✅ | — | UNIQUE – מזהה שיחה חיצוני |
| `phone` | VARCHAR(20) | ✅ | — | טלפון |
| `session_data` | JSONB | ✅ | '{}' | נתוני שיחה (intent, inputs) |
| `created_at` | TIMESTAMP | ✅ | now() | — |
| `updated_at` | TIMESTAMP | ✅ | now() | — |

---

### 14. `notifications` – התראות

| שדה | סוג | חובה | ברירת מחדל | תיאור |
|-----|------|------|-----------|--------|
| `id` | UUID | ✅ | auto-generate | מזהה |
| `type` | ENUM('SMS','CALL','WHATSAPP','PUSH') | ✅ | — | סוג התראה |
| `recipient_user_id` | UUID (FK → users) | ✅ | — | נמען |
| `payload` | JSONB | ✅ | — | תוכן ההתראה |
| `status` | ENUM('PENDING','SENT','DELIVERED','FAILED') | ✅ | 'PENDING' | סטטוס |
| `sent_at` | TIMESTAMP | ❌ | NULL | מועד שליחה |
| `created_at` | TIMESTAMP | ✅ | now() | — |

---

## Enums

```sql
CREATE TYPE app_role AS ENUM ('PARENT', 'BABYSITTER', 'GUARDIAN', 'ADMIN');
CREATE TYPE user_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED');
CREATE TYPE approval_mode AS ENUM ('AUTO_APPROVE', 'APPROVE_EACH_REQUEST', 'APPROVE_NEW_FAMILIES');
CREATE TYPE approval_level AS ENUM ('VIEW_ONLY', 'FULL_CONTROL');
CREATE TYPE request_status AS ENUM ('NEW', 'MATCHING', 'PENDING_RESPONSES', 'PENDING_SELECTION', 'PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
CREATE TYPE candidate_call_status AS ENUM ('PENDING', 'CALLING', 'COMPLETED', 'NO_ANSWER', 'FAILED');
CREATE TYPE candidate_response AS ENUM ('PENDING', 'INTERESTED', 'DECLINED', 'GUARDIAN_PENDING', 'GUARDIAN_APPROVED', 'GUARDIAN_DECLINED');
CREATE TYPE booking_status AS ENUM ('CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'FAILED');
CREATE TYPE preferred_channel AS ENUM ('PHONE', 'WEB', 'BOTH');
CREATE TYPE notification_type AS ENUM ('SMS', 'CALL', 'WHATSAPP', 'PUSH');
CREATE TYPE notification_status AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED');
```

---

## קשרים בין טבלאות

```
┌─────────────┐       ┌──────────────┐
│   users     │──1:N──│  user_roles   │
│             │       └──────────────┘
│  id (PK)    │
│  phone (UQ) │──1:1──┌──────────────────┐
│             │       │ parent_profiles   │──N:1──┌────────────┐
│             │       │  city_id (FK)     │───────│   cities   │──1:N──┌─────────────────┐
│             │       │  neighborhood_id  │───────│            │       │ neighborhoods   │
│             │       │  community_style  │──┐    └────────────┘       └─────────────────┘
│             │       └──────────────────┘  │
│             │                             │    ┌───────────────────┐
│             │──1:1──┌──────────────────┐  ├───→│ community_styles  │
│             │       │babysitter_profiles│──┘    └───────────────────┘
│             │       │  city_id (FK)     │
│             │       │  neighborhood_id  │
│             │       │  guardian_id (FK) │──N:1──┌───────────────────┐
│             │       └──────────────────┘       │ guardian_profiles  │
│             │──1:1─────────────────────────────│  user_id (FK)     │
└─────────────┘                                  └───────────────────┘

┌──────────────────┐       ┌─────────────────────┐
│  parent_profiles │──1:N──│   job_requests       │
└──────────────────┘       │  city_id (FK)        │
                           │  neighborhood_id(FK) │
                           │  community_style(FK) │──1:N──┌─────────────────────┐
                           └──────────────────────┘       │ request_candidates  │
                                                          │  babysitter_id (FK) │──N:1── babysitter_profiles
                           ┌──────────────────────┐       └─────────────────────┘
                           │     bookings          │
                           │  request_id (FK, UQ)  │──1:1── job_requests
                           │  parent_id (FK)       │──N:1── parent_profiles
                           │  babysitter_id (FK)   │──N:1── babysitter_profiles
                           └──────────────────────┘

┌─────────────┐       ┌────────────────┐
│   users     │──1:N──│ notifications   │
└─────────────┘       └────────────────┘
```

### סיכום קשרים:

| מקור | יעד | סוג | שדה מקשר |
|------|------|------|----------|
| users | user_roles | 1:N | user_id |
| users | parent_profiles | 1:1 | user_id (UNIQUE) |
| users | babysitter_profiles | 1:1 | user_id (UNIQUE) |
| users | guardian_profiles | 1:1 | user_id (UNIQUE) |
| users | notifications | 1:N | recipient_user_id |
| cities | neighborhoods | 1:N | city_id |
| cities | parent_profiles | 1:N | city_id |
| cities | babysitter_profiles | 1:N | city_id |
| cities | job_requests | 1:N | city_id |
| neighborhoods | parent_profiles | 1:N | neighborhood_id |
| neighborhoods | babysitter_profiles | 1:N | neighborhood_id |
| neighborhoods | job_requests | 1:N | neighborhood_id |
| community_styles | parent_profiles | 1:N | community_style_id |
| community_styles | babysitter_profiles | 1:N | community_style_id |
| community_styles | job_requests | 1:N | community_style_id |
| guardian_profiles | babysitter_profiles | 1:N | guardian_id |
| parent_profiles | job_requests | 1:N | parent_id |
| job_requests | request_candidates | 1:N | request_id |
| babysitter_profiles | request_candidates | 1:N | babysitter_id |
| job_requests | bookings | 1:1 | request_id (UNIQUE) |
| parent_profiles | bookings | 1:N | parent_id |
| babysitter_profiles | bookings | 1:N | babysitter_id |

---

## אינדקסים מומלצים

```sql
-- ביצועי חיפוש
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_parent_profiles_city ON parent_profiles(city_id);
CREATE INDEX idx_parent_profiles_neighborhood ON parent_profiles(neighborhood_id);
CREATE INDEX idx_babysitter_profiles_city ON babysitter_profiles(city_id);
CREATE INDEX idx_babysitter_profiles_neighborhood ON babysitter_profiles(neighborhood_id);
CREATE INDEX idx_job_requests_parent ON job_requests(parent_id);
CREATE INDEX idx_job_requests_status ON job_requests(status);
CREATE INDEX idx_job_requests_city_neighborhood ON job_requests(city_id, neighborhood_id);
CREATE INDEX idx_job_requests_datetime ON job_requests(datetime_start, datetime_end);
CREATE INDEX idx_request_candidates_request ON request_candidates(request_id);
CREATE INDEX idx_request_candidates_babysitter ON request_candidates(babysitter_id);
CREATE INDEX idx_bookings_parent ON bookings(parent_id);
CREATE INDEX idx_bookings_babysitter ON bookings(babysitter_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_otp_phone_code ON otp_verifications(phone, code);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
```

---

## Prisma Schema מלא

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ──── Enums ────

enum AppRole {
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

enum ApprovalLevel {
  VIEW_ONLY
  FULL_CONTROL
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

enum PreferredChannel {
  PHONE
  WEB
  BOTH
}

enum NotificationType {
  SMS
  CALL
  WHATSAPP
  PUSH
}

enum NotificationStatus {
  PENDING
  SENT
  DELIVERED
  FAILED
}

// ──── Models ────

model User {
  id         String     @id @default(uuid())
  phone      String     @unique
  email      String?
  isVerified Boolean    @default(false) @map("is_verified")
  status     UserStatus @default(PENDING)
  createdAt  DateTime   @default(now()) @map("created_at")
  updatedAt  DateTime   @updatedAt @map("updated_at")

  roles             UserRole[]
  parentProfile     ParentProfile?
  babysitterProfile BabysitterProfile?
  guardianProfile   GuardianProfile?
  notifications     Notification[]

  @@map("users")
}

model UserRole {
  id     String  @id @default(uuid())
  userId String  @map("user_id")
  role   AppRole

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, role])
  @@map("user_roles")
}

model City {
  id   String @id @default(uuid())
  name String @unique

  neighborhoods      Neighborhood[]
  parentProfiles     ParentProfile[]
  babysitterProfiles BabysitterProfile[]
  jobRequests        JobRequest[]

  @@map("cities")
}

model Neighborhood {
  id     String @id @default(uuid())
  cityId String @map("city_id")
  name   String

  city               City                @relation(fields: [cityId], references: [id])
  parentProfiles     ParentProfile[]
  babysitterProfiles BabysitterProfile[]
  jobRequests        JobRequest[]

  @@unique([cityId, name])
  @@map("neighborhoods")
}

model CommunityStyle {
  id          String  @id @default(uuid())
  label       String  @unique
  description String?
  active      Boolean @default(true)

  parentProfiles     ParentProfile[]
  babysitterProfiles BabysitterProfile[]
  jobRequests        JobRequest[]

  @@map("community_styles")
}

model ParentProfile {
  id               String   @id @default(uuid())
  userId           String   @unique @map("user_id")
  fullName         String   @map("full_name")
  address          String
  cityId           String   @map("city_id")
  neighborhoodId   String   @map("neighborhood_id")
  childrenAges     Int[]    @map("children_ages")
  householdNotes   String?  @map("household_notes")
  communityStyleId String?  @map("community_style_id")
  languages        String[] @default([])
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  user           User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  city           City            @relation(fields: [cityId], references: [id])
  neighborhood   Neighborhood    @relation(fields: [neighborhoodId], references: [id])
  communityStyle CommunityStyle? @relation(fields: [communityStyleId], references: [id])
  jobRequests    JobRequest[]
  bookings       Booking[]

  @@map("parent_profiles")
}

model BabysitterProfile {
  id                       String       @id @default(uuid())
  userId                   String       @unique @map("user_id")
  fullName                 String       @map("full_name")
  age                      Int
  cityId                   String       @map("city_id")
  neighborhoodId           String       @map("neighborhood_id")
  walkingRadiusKm          Float        @default(2.0) @map("walking_radius_km")
  serviceAreas             String[]     @default([]) @map("service_areas")
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

  user           User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  city           City              @relation(fields: [cityId], references: [id])
  neighborhood   Neighborhood      @relation(fields: [neighborhoodId], references: [id])
  communityStyle CommunityStyle?   @relation(fields: [communityStyleId], references: [id])
  guardian       GuardianProfile?  @relation(fields: [guardianId], references: [id])
  candidates     RequestCandidate[]
  bookings       Booking[]

  @@map("babysitter_profiles")
}

model GuardianProfile {
  id               String           @id @default(uuid())
  userId           String           @unique @map("user_id")
  fullName         String           @map("full_name")
  phone            String
  preferredChannel PreferredChannel @default(BOTH) @map("preferred_channel")
  approvalLevel    ApprovalLevel    @default(FULL_CONTROL) @map("approval_level")
  verified         Boolean          @default(false)
  createdAt        DateTime         @default(now()) @map("created_at")

  user        User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  babysitters BabysitterProfile[]

  @@map("guardian_profiles")
}

model JobRequest {
  id               String        @id @default(uuid())
  parentId         String        @map("parent_id")
  cityId           String        @map("city_id")
  neighborhoodId   String        @map("neighborhood_id")
  address          String?
  datetimeStart    DateTime      @map("datetime_start")
  datetimeEnd      DateTime      @map("datetime_end")
  childrenAges     Int[]         @map("children_ages")
  requirements     String?
  minBabysitterAge Int?          @map("min_babysitter_age")
  maxBabysitterAge Int?          @map("max_babysitter_age")
  communityStyleId String?       @map("community_style_id")
  status           RequestStatus @default(NEW)
  createdAt        DateTime      @default(now()) @map("created_at")
  updatedAt        DateTime      @updatedAt @map("updated_at")

  parent         ParentProfile      @relation(fields: [parentId], references: [id])
  city           City               @relation(fields: [cityId], references: [id])
  neighborhood   Neighborhood       @relation(fields: [neighborhoodId], references: [id])
  communityStyle CommunityStyle?    @relation(fields: [communityStyleId], references: [id])
  candidates     RequestCandidate[]
  booking        Booking?

  @@map("job_requests")
}

model RequestCandidate {
  id                    String              @id @default(uuid())
  requestId             String              @map("request_id")
  babysitterId          String              @map("babysitter_id")
  callStatus            CandidateCallStatus @default(PENDING) @map("call_status")
  callAttempts          Int                 @default(0) @map("call_attempts")
  response              CandidateResponse   @default(PENDING)
  babysitterRespondedAt DateTime?           @map("babysitter_responded_at")
  guardianRespondedAt   DateTime?           @map("guardian_responded_at")
  createdAt             DateTime            @default(now()) @map("created_at")

  request    JobRequest        @relation(fields: [requestId], references: [id])
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
  paymentAmount   Decimal?      @map("payment_amount") @db.Decimal(10, 2)
  confirmedAt     DateTime      @default(now()) @map("confirmed_at")
  startedAt       DateTime?     @map("started_at")
  completedAt     DateTime?     @map("completed_at")
  parentRating    Int?          @map("parent_rating")
  parentReview    String?       @map("parent_review")
  babysitterRating Int?         @map("babysitter_rating")
  createdAt       DateTime      @default(now()) @map("created_at")

  request    JobRequest        @relation(fields: [requestId], references: [id])
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

model Notification {
  id              String             @id @default(uuid())
  type            NotificationType
  recipientUserId String             @map("recipient_user_id")
  payload         Json
  status          NotificationStatus @default(PENDING)
  sentAt          DateTime?          @map("sent_at")
  createdAt       DateTime           @default(now()) @map("created_at")

  recipient User @relation(fields: [recipientUserId], references: [id], onDelete: Cascade)

  @@map("notifications")
}
```

---

## SQL DDL

```sql
-- ==========================================
-- DDL מלא ליצירת כל הטבלאות
-- PostgreSQL
-- ==========================================

-- Enums
CREATE TYPE app_role AS ENUM ('PARENT', 'BABYSITTER', 'GUARDIAN', 'ADMIN');
CREATE TYPE user_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED');
CREATE TYPE approval_mode AS ENUM ('AUTO_APPROVE', 'APPROVE_EACH_REQUEST', 'APPROVE_NEW_FAMILIES');
CREATE TYPE approval_level AS ENUM ('VIEW_ONLY', 'FULL_CONTROL');
CREATE TYPE request_status AS ENUM ('NEW', 'MATCHING', 'PENDING_RESPONSES', 'PENDING_SELECTION', 'PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
CREATE TYPE candidate_call_status AS ENUM ('PENDING', 'CALLING', 'COMPLETED', 'NO_ANSWER', 'FAILED');
CREATE TYPE candidate_response AS ENUM ('PENDING', 'INTERESTED', 'DECLINED', 'GUARDIAN_PENDING', 'GUARDIAN_APPROVED', 'GUARDIAN_DECLINED');
CREATE TYPE booking_status AS ENUM ('CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'FAILED');
CREATE TYPE preferred_channel AS ENUM ('PHONE', 'WEB', 'BOTH');
CREATE TYPE notification_type AS ENUM ('SMS', 'CALL', 'WHATSAPP', 'PUSH');
CREATE TYPE notification_status AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED');

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  status user_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- User Roles (separate table for security!)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Cities
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Neighborhoods
CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES cities(id),
  name VARCHAR(100) NOT NULL,
  UNIQUE(city_id, name)
);

-- Community Styles
CREATE TABLE community_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true
);

-- Parent Profiles
CREATE TABLE parent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city_id UUID NOT NULL REFERENCES cities(id),
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id),
  children_ages INT[] NOT NULL,
  household_notes TEXT,
  community_style_id UUID REFERENCES community_styles(id),
  languages VARCHAR[] DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Guardian Profiles
CREATE TABLE guardian_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  preferred_channel preferred_channel NOT NULL DEFAULT 'BOTH',
  approval_level approval_level NOT NULL DEFAULT 'FULL_CONTROL',
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Babysitter Profiles
CREATE TABLE babysitter_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  city_id UUID NOT NULL REFERENCES cities(id),
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id),
  walking_radius_km FLOAT NOT NULL DEFAULT 2.0,
  service_areas VARCHAR[] DEFAULT '{}',
  availability JSONB NOT NULL DEFAULT '[]',
  experience_years INT NOT NULL DEFAULT 0,
  community_style_id UUID REFERENCES community_styles(id),
  guardian_id UUID REFERENCES guardian_profiles(id),
  guardian_required_approval BOOLEAN NOT NULL DEFAULT false,
  approval_mode approval_mode NOT NULL DEFAULT 'APPROVE_EACH_REQUEST',
  rating FLOAT NOT NULL DEFAULT 0,
  total_reviews INT NOT NULL DEFAULT 0,
  bio TEXT,
  languages VARCHAR[] DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Job Requests
CREATE TABLE job_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES parent_profiles(id),
  city_id UUID NOT NULL REFERENCES cities(id),
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id),
  address VARCHAR(255),
  datetime_start TIMESTAMP NOT NULL,
  datetime_end TIMESTAMP NOT NULL,
  children_ages INT[] NOT NULL,
  requirements TEXT,
  min_babysitter_age INT,
  max_babysitter_age INT,
  community_style_id UUID REFERENCES community_styles(id),
  status request_status NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Request Candidates
CREATE TABLE request_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES job_requests(id),
  babysitter_id UUID NOT NULL REFERENCES babysitter_profiles(id),
  call_status candidate_call_status NOT NULL DEFAULT 'PENDING',
  call_attempts INT NOT NULL DEFAULT 0,
  response candidate_response NOT NULL DEFAULT 'PENDING',
  babysitter_responded_at TIMESTAMP,
  guardian_responded_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE(request_id, babysitter_id)
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL UNIQUE REFERENCES job_requests(id),
  parent_id UUID NOT NULL REFERENCES parent_profiles(id),
  babysitter_id UUID NOT NULL REFERENCES babysitter_profiles(id),
  datetime_start TIMESTAMP NOT NULL,
  datetime_end TIMESTAMP NOT NULL,
  address VARCHAR(255) NOT NULL,
  status booking_status NOT NULL DEFAULT 'CONFIRMED',
  payment_status payment_status NOT NULL DEFAULT 'PENDING',
  payment_amount DECIMAL(10,2),
  confirmed_at TIMESTAMP NOT NULL DEFAULT now(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  parent_rating INT CHECK (parent_rating BETWEEN 1 AND 5),
  babysitter_rating INT CHECK (babysitter_rating BETWEEN 1 AND 5),
  parent_review TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- OTP Verifications
CREATE TABLE otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Telephony Sessions
CREATE TABLE telephony_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  session_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type notification_type NOT NULL,
  recipient_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  status notification_status NOT NULL DEFAULT 'PENDING',
  sent_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- ==========================================
-- Indexes
-- ==========================================
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_parent_profiles_city ON parent_profiles(city_id);
CREATE INDEX idx_parent_profiles_neighborhood ON parent_profiles(neighborhood_id);
CREATE INDEX idx_babysitter_profiles_city ON babysitter_profiles(city_id);
CREATE INDEX idx_babysitter_profiles_neighborhood ON babysitter_profiles(neighborhood_id);
CREATE INDEX idx_job_requests_parent ON job_requests(parent_id);
CREATE INDEX idx_job_requests_status ON job_requests(status);
CREATE INDEX idx_job_requests_city_neighborhood ON job_requests(city_id, neighborhood_id);
CREATE INDEX idx_job_requests_datetime ON job_requests(datetime_start, datetime_end);
CREATE INDEX idx_request_candidates_request ON request_candidates(request_id);
CREATE INDEX idx_request_candidates_babysitter ON request_candidates(babysitter_id);
CREATE INDEX idx_bookings_parent ON bookings(parent_id);
CREATE INDEX idx_bookings_babysitter ON bookings(babysitter_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_otp_phone_code ON otp_verifications(phone, code);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
```

---

## שפות נתמכות (Frontend Reference)

הפרונטאנד תומך בשפות הבאות (נשמרות כ-`VARCHAR[]` בפרופילים):

| ערך | תווית |
|-----|--------|
| `hebrew` | עברית |
| `english` | אנגלית |
| `russian` | רוסית |
| `french` | צרפתית |
| `spanish` | ספרדית |
| `arabic` | ערבית |
| `amharic` | אמהרית |
| `yiddish` | יידיש |

---

## API Endpoints (Reference)

ה-Frontend מצפה לנקודות קצה הבאות (פירוט מלא ב-`docs/api-specification.yaml`):

| Method | Endpoint | תיאור |
|--------|----------|--------|
| POST | `/auth/send-otp` | שליחת OTP |
| POST | `/auth/verify-otp` | אימות OTP → JWT |
| GET | `/auth/me` | משתמש נוכחי |
| POST | `/users/register/parent` | הרשמת הורה |
| POST | `/users/register/babysitter` | הרשמת בייביסיטרית |
| GET/PUT | `/users/parent/:id` | פרופיל הורה |
| GET/PUT | `/users/babysitter/:id` | פרופיל בייביסיטרית |
| POST | `/guardians/link` | קישור אפוטרופוס |
| POST | `/guardians/:id/approve/:candidateId` | אישור אפוטרופוס |
| GET | `/community-styles` | סגנונות קהילה |
| GET | `/locations/cities` | ערים |
| GET | `/locations/cities/:id/neighborhoods` | שכונות |
| POST | `/requests` | יצירת בקשה |
| GET | `/requests/:id/candidates` | מועמדות |
| POST | `/requests/:id/select` | בחירת בייביסיטרית |
| POST | `/matching/find/:requestId` | הפעלת התאמה |
| POST | `/telephony/incoming-call` | שיחה נכנסת (IVR) |
| POST | `/telephony/collect-input` | קלט DTMF |

---

> 📌 **הערה למפתח Backend:** המסמך הזה מכיל את כל מה שצריך לבניית השרת. השתמש ב-Prisma Schema או ב-SQL DDL ליצירת מסד הנתונים, וב-API Endpoints כחוזה בין הפרונטאנד לשרת.
