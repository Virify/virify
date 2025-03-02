-- DropForeignKey
ALTER TABLE "Verification" DROP CONSTRAINT "Verification_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
