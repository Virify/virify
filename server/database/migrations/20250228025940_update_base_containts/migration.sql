/*
  Warnings:

  - The values [SENIOR_NEGOTIATOR,SALES_NEGOTIATOR,ADMIN_MARKETING] on the enum `AgentRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AgentRole_new" AS ENUM ('SENIOR', 'JUNIOR');
ALTER TABLE "Agent" ALTER COLUMN "role" TYPE "AgentRole_new" USING ("role"::text::"AgentRole_new");
ALTER TYPE "AgentRole" RENAME TO "AgentRole_old";
ALTER TYPE "AgentRole_new" RENAME TO "AgentRole";
DROP TYPE "AgentRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Owner" DROP CONSTRAINT "Owner_umbrellaId_fkey";

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "isActivated" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'SENIOR';

-- AlterTable
ALTER TABLE "Owner" ADD COLUMN     "isActivated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mainContact" TEXT,
ALTER COLUMN "businessName" DROP NOT NULL,
ALTER COLUMN "addressLine1" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "postcode" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "companyRegistration" DROP NOT NULL,
ALTER COLUMN "umbrellaId" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_umbrellaId_fkey" FOREIGN KEY ("umbrellaId") REFERENCES "Umbrella"("id") ON DELETE SET NULL ON UPDATE CASCADE;
