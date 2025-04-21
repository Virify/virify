-- AlterTable
ALTER TABLE "Owner" ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "otpCode" TEXT,
ADD COLUMN     "otpCodeExpiry" TIMESTAMP(3);
