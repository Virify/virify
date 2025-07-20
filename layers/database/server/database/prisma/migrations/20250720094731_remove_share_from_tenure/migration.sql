/*
  Warnings:

  - The values [SHARE_OF_FREEHOLD] on the enum `TenureType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `downstairs` on the `Bathroom` table. All the data in the column will be lost.
  - You are about to drop the column `upstairs` on the `Bathroom` table. All the data in the column will be lost.
  - You are about to drop the column `ownershipType` on the `SaleListing` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TenureType_new" AS ENUM ('FREEHOLD', 'LEASEHOLD', 'COMMONHOLD');
ALTER TABLE "SaleListing" ALTER COLUMN "tenureType" TYPE "TenureType_new" USING ("tenureType"::text::"TenureType_new");
ALTER TYPE "TenureType" RENAME TO "TenureType_old";
ALTER TYPE "TenureType_new" RENAME TO "TenureType";
DROP TYPE "TenureType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Bathroom" DROP COLUMN "downstairs",
DROP COLUMN "upstairs";

-- AlterTable
ALTER TABLE "SaleListing" DROP COLUMN "ownershipType",
ADD COLUMN     "sharedOwnership" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "chain" SET DEFAULT false;

-- DropEnum
DROP TYPE "OwnershipType";
