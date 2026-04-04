/*
  Warnings:

  - You are about to drop the column `userId` on the `UserNotificationPreferences` table. All the data in the column will be lost.
  - Added the required column `userPreferencesId` to the `UserNotificationPreferences` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserNotificationPreferences" DROP CONSTRAINT "UserNotificationPreferences_userId_fkey";

-- DropIndex
DROP INDEX "UserNotificationPreferences_userId_idx";

-- DropIndex
DROP INDEX "UserNotificationPreferences_userId_key";

-- AlterTable
ALTER TABLE "UserNotificationPreferences" DROP COLUMN "userId",
ADD COLUMN     "userPreferencesId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "UserNotificationPreferences_userPreferencesId_idx" ON "UserNotificationPreferences"("userPreferencesId");

-- AddForeignKey
ALTER TABLE "UserNotificationPreferences" ADD CONSTRAINT "UserNotificationPreferences_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
