-- AlterTable
ALTER TABLE "public"."Garden" ADD COLUMN     "additionalDetails" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "size" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Land" ADD COLUMN     "additionalDetails" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "size" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Yard" ADD COLUMN     "additionalDetails" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "size" DOUBLE PRECISION;
