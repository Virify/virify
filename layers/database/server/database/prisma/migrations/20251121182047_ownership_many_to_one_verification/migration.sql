-- DropIndex
DROP INDEX "UserOwnership_verificationId_key";

-- AlterTable
ALTER TABLE "UserOwnership" ADD COLUMN     "reviewed" "Reviewed" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "verificationId" DROP NOT NULL;
