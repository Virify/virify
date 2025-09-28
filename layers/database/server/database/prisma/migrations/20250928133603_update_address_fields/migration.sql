-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "district" TEXT,
ADD COLUMN     "locality" TEXT,
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Bathroom" ALTER COLUMN "description" DROP NOT NULL;
