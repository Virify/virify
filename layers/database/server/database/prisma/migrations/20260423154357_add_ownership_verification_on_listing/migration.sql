/*
  Warnings:

  - You are about to drop the column `verificationLevel` on the `DraftListing` table. All the data in the column will be lost.
  - You are about to drop the column `estateAgentId` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `verificationLevel` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the `Agent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EstateAgent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AgentToListing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AgentToProperty` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_estateAgentId_fkey";

-- DropForeignKey
ALTER TABLE "EstateAgent" DROP CONSTRAINT "EstateAgent_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_estateAgentId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_estateAgentId_fkey";

-- DropForeignKey
ALTER TABLE "Verification" DROP CONSTRAINT "Verification_estateAgentId_fkey";

-- DropForeignKey
ALTER TABLE "_AgentToListing" DROP CONSTRAINT "_AgentToListing_A_fkey";

-- DropForeignKey
ALTER TABLE "_AgentToListing" DROP CONSTRAINT "_AgentToListing_B_fkey";

-- DropForeignKey
ALTER TABLE "_AgentToProperty" DROP CONSTRAINT "_AgentToProperty_A_fkey";

-- DropForeignKey
ALTER TABLE "_AgentToProperty" DROP CONSTRAINT "_AgentToProperty_B_fkey";

-- DropIndex
DROP INDEX "Listing_estateAgentId_idx";

-- AlterTable
ALTER TABLE "DraftListing" DROP COLUMN "verificationLevel",
ADD COLUMN     "ownershipVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "estateAgentId",
DROP COLUMN "verificationLevel",
ADD COLUMN     "ownershipVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "legalName" TEXT,
ADD COLUMN     "ownership" BOOLEAN;

-- DropTable
DROP TABLE "Agent";

-- DropTable
DROP TABLE "EstateAgent";

-- DropTable
DROP TABLE "_AgentToListing";

-- DropTable
DROP TABLE "_AgentToProperty";

-- DropEnum
DROP TYPE "AgentRole";

-- DropEnum
DROP TYPE "VerificationLevel";
