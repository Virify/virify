-- CreateEnum
CREATE TYPE "UserIntent" AS ENUM ('BUYING', 'SELLING', 'RENTING', 'LANDLORD');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "intents" "UserIntent"[],
ADD COLUMN     "interests" TEXT[];
