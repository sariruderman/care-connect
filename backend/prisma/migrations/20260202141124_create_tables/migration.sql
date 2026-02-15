-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PARENT', 'BABYSITTER', 'GUARDIAN', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "languages" TEXT[],
    "email" TEXT,

    CONSTRAINT "ParentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BabysitterProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "cityId" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "walking_radius_minutes" INTEGER NOT NULL,
    "service_areas" TEXT[],
    "experience_years" INTEGER NOT NULL,
    "communityStyleId" TEXT,
    "bio" TEXT,
    "has_guardian" BOOLEAN NOT NULL,
    "guardianId" TEXT,
    "approval_mode" TEXT NOT NULL,
    "languages" TEXT[],

    CONSTRAINT "BabysitterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardianProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GuardianProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "datetime_start" TIMESTAMP(3) NOT NULL,
    "datetime_end" TIMESTAMP(3) NOT NULL,
    "area" TEXT NOT NULL,
    "children_ages" INTEGER[],

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestCandidate" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "babysitterId" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "RequestCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "babysitterId" TEXT NOT NULL,
    "datetime_start" TIMESTAMP(3) NOT NULL,
    "datetime_end" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "neighborhoods" TEXT[],

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityStyle" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CommunityStyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelephonySession" (
    "id" TEXT NOT NULL,
    "call_id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelephonySession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ParentProfile_userId_key" ON "ParentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BabysitterProfile_userId_key" ON "BabysitterProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BabysitterProfile_guardianId_key" ON "BabysitterProfile"("guardianId");

-- CreateIndex
CREATE UNIQUE INDEX "GuardianProfile_userId_key" ON "GuardianProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityStyle_label_key" ON "CommunityStyle"("label");

-- CreateIndex
CREATE UNIQUE INDEX "TelephonySession_call_id_key" ON "TelephonySession"("call_id");

-- AddForeignKey
ALTER TABLE "ParentProfile" ADD CONSTRAINT "ParentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentProfile" ADD CONSTRAINT "ParentProfile_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BabysitterProfile" ADD CONSTRAINT "BabysitterProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BabysitterProfile" ADD CONSTRAINT "BabysitterProfile_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BabysitterProfile" ADD CONSTRAINT "BabysitterProfile_communityStyleId_fkey" FOREIGN KEY ("communityStyleId") REFERENCES "CommunityStyle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BabysitterProfile" ADD CONSTRAINT "BabysitterProfile_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "GuardianProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianProfile" ADD CONSTRAINT "GuardianProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestCandidate" ADD CONSTRAINT "RequestCandidate_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestCandidate" ADD CONSTRAINT "RequestCandidate_babysitterId_fkey" FOREIGN KEY ("babysitterId") REFERENCES "BabysitterProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_babysitterId_fkey" FOREIGN KEY ("babysitterId") REFERENCES "BabysitterProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
