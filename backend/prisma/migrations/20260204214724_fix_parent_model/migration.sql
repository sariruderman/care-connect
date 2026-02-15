/*
  Warnings:

  - You are about to drop the column `has_guardian` on the `BabysitterProfile` table. All the data in the column will be lost.
  - Made the column `communityStyleId` on table `BabysitterProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BabysitterProfile" DROP CONSTRAINT "BabysitterProfile_communityStyleId_fkey";

-- AlterTable
ALTER TABLE "BabysitterProfile" DROP COLUMN "has_guardian",
ALTER COLUMN "communityStyleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "BabysitterProfile" ADD CONSTRAINT "BabysitterProfile_communityStyleId_fkey" FOREIGN KEY ("communityStyleId") REFERENCES "CommunityStyle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
