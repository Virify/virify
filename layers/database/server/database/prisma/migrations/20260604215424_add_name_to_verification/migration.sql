-- AlterTable
ALTER TABLE "OwnershipVerification" ALTER COLUMN "reviewTokenExpiry" SET DEFAULT NOW() + INTERVAL '30 days';

-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "name" BOOLEAN;
