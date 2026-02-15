/*
  Warnings:

  - You are about to drop the `BabysitterProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommunityStyle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuardianProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParentProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RequestCandidate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TelephonySession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "ApprovalMode" AS ENUM ('AUTO_APPROVE', 'APPROVE_EACH_REQUEST', 'APPROVE_NEW_FAMILIES');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'MATCHING', 'PENDING_RESPONSES', 'PENDING_SELECTION', 'PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CandidateCallStatus" AS ENUM ('PENDING', 'CALLING', 'COMPLETED', 'NO_ANSWER', 'FAILED');

-- CreateEnum
CREATE TYPE "CandidateResponse" AS ENUM ('PENDING', 'INTERESTED', 'DECLINED', 'GUARDIAN_PENDING', 'GUARDIAN_APPROVED', 'GUARDIAN_DECLINED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'FAILED');

-- DropForeignKey
ALTER TABLE "BabysitterProfile" DROP CONSTRAINT "BabysitterProfile_cityId_fkey";

-- DropForeignKey
ALTER TABLE "BabysitterProfile" DROP CONSTRAINT "BabysitterProfile_communityStyleId_fkey";

-- DropForeignKey
ALTER TABLE "BabysitterProfile" DROP CONSTRAINT "BabysitterProfile_guardianId_fkey";

-- DropForeignKey
ALTER TABLE "BabysitterProfile" DROP CONSTRAINT "BabysitterProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_babysitterId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_requestId_fkey";

-- DropForeignKey
ALTER TABLE "GuardianProfile" DROP CONSTRAINT "GuardianProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "ParentProfile" DROP CONSTRAINT "ParentProfile_cityId_fkey";

-- DropForeignKey
ALTER TABLE "ParentProfile" DROP CONSTRAINT "ParentProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_parentId_fkey";

-- DropForeignKey
ALTER TABLE "RequestCandidate" DROP CONSTRAINT "RequestCandidate_babysitterId_fkey";

-- DropForeignKey
ALTER TABLE "RequestCandidate" DROP CONSTRAINT "RequestCandidate_requestId_fkey";

-- DropTable
DROP TABLE "BabysitterProfile";

-- DropTable
DROP TABLE "Booking";

-- DropTable
DROP TABLE "City";

-- DropTable
DROP TABLE "CommunityStyle";

-- DropTable
DROP TABLE "GuardianProfile";

-- DropTable
DROP TABLE "ParentProfile";

-- DropTable
DROP TABLE "Request";

-- DropTable
DROP TABLE "RequestCandidate";

-- DropTable
DROP TABLE "TelephonySession";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "neighborhoods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,

    CONSTRAINT "neighborhoods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_styles" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "community_styles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "neighborhood_id" TEXT NOT NULL,
    "children_ages" INTEGER[],
    "household_notes" TEXT,
    "community_style_id" TEXT,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parent_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "babysitter_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "city_id" TEXT NOT NULL,
    "neighborhood_id" TEXT NOT NULL,
    "walking_radius_minutes" INTEGER NOT NULL,
    "service_areas" TEXT[],
    "availability" JSONB NOT NULL DEFAULT '[]',
    "experience_years" INTEGER NOT NULL,
    "community_style_id" TEXT,
    "guardian_id" TEXT,
    "guardian_required_approval" BOOLEAN NOT NULL DEFAULT false,
    "approval_mode" "ApprovalMode" NOT NULL DEFAULT 'APPROVE_EACH_REQUEST',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "bio" TEXT,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "babysitter_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guardian_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "preferred_channel" TEXT NOT NULL DEFAULT 'BOTH',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guardian_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "datetime_start" TIMESTAMP(3) NOT NULL,
    "datetime_end" TIMESTAMP(3) NOT NULL,
    "area" TEXT NOT NULL,
    "address" TEXT,
    "children_ages" INTEGER[],
    "requirements" TEXT,
    "min_babysitter_age" INTEGER,
    "max_babysitter_age" INTEGER,
    "community_style_id" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_candidates" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "babysitter_id" TEXT NOT NULL,
    "call_status" "CandidateCallStatus" NOT NULL DEFAULT 'PENDING',
    "call_attempts" INTEGER NOT NULL DEFAULT 0,
    "response" "CandidateResponse" NOT NULL DEFAULT 'PENDING',
    "babysitter_responded_at" TIMESTAMP(3),
    "guardian_responded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "babysitter_id" TEXT NOT NULL,
    "datetime_start" TIMESTAMP(3) NOT NULL,
    "datetime_end" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_amount" DECIMAL(10,2),
    "confirmed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "parent_rating" INTEGER,
    "parent_review" TEXT,
    "babysitter_rating" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_verifications" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telephony_sessions" (
    "id" TEXT NOT NULL,
    "call_id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "session_data" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "telephony_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_key" ON "cities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "neighborhoods_city_id_name_key" ON "neighborhoods"("city_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "community_styles_label_key" ON "community_styles"("label");

-- CreateIndex
CREATE UNIQUE INDEX "parent_profiles_user_id_key" ON "parent_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "babysitter_profiles_user_id_key" ON "babysitter_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "guardian_profiles_user_id_key" ON "guardian_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "request_candidates_request_id_babysitter_id_key" ON "request_candidates"("request_id", "babysitter_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_request_id_key" ON "bookings"("request_id");

-- CreateIndex
CREATE INDEX "otp_verifications_phone_code_idx" ON "otp_verifications"("phone", "code");

-- CreateIndex
CREATE UNIQUE INDEX "telephony_sessions_call_id_key" ON "telephony_sessions"("call_id");

-- AddForeignKey
ALTER TABLE "neighborhoods" ADD CONSTRAINT "neighborhoods_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_profiles" ADD CONSTRAINT "parent_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_profiles" ADD CONSTRAINT "parent_profiles_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_profiles" ADD CONSTRAINT "parent_profiles_neighborhood_id_fkey" FOREIGN KEY ("neighborhood_id") REFERENCES "neighborhoods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_profiles" ADD CONSTRAINT "parent_profiles_community_style_id_fkey" FOREIGN KEY ("community_style_id") REFERENCES "community_styles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "babysitter_profiles" ADD CONSTRAINT "babysitter_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "babysitter_profiles" ADD CONSTRAINT "babysitter_profiles_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "babysitter_profiles" ADD CONSTRAINT "babysitter_profiles_neighborhood_id_fkey" FOREIGN KEY ("neighborhood_id") REFERENCES "neighborhoods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "babysitter_profiles" ADD CONSTRAINT "babysitter_profiles_community_style_id_fkey" FOREIGN KEY ("community_style_id") REFERENCES "community_styles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "babysitter_profiles" ADD CONSTRAINT "babysitter_profiles_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "guardian_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardian_profiles" ADD CONSTRAINT "guardian_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_candidates" ADD CONSTRAINT "request_candidates_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_candidates" ADD CONSTRAINT "request_candidates_babysitter_id_fkey" FOREIGN KEY ("babysitter_id") REFERENCES "babysitter_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_babysitter_id_fkey" FOREIGN KEY ("babysitter_id") REFERENCES "babysitter_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
