-- AlterTable
ALTER TABLE "public"."Kitchen" ADD COLUMN     "floor" INTEGER,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "roomNumber" INTEGER;

-- AlterTable
ALTER TABLE "public"."Property" ADD COLUMN     "numberKitchens" INTEGER DEFAULT 0;
