/*
  Warnings:

  - You are about to drop the column `guardian_name` on the `BabysitterProfile` table. All the data in the column will be lost.
  - You are about to drop the column `guardian_phone` on the `BabysitterProfile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "BabysitterProfile_guardianId_key";

-- AlterTable
ALTER TABLE "BabysitterProfile" DROP COLUMN "guardian_name",
DROP COLUMN "guardian_phone",
ADD COLUMN     "hasGuardian" BOOLEAN NOT NULL DEFAULT false;
