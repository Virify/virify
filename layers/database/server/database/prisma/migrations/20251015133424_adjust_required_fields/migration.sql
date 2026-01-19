-- AlterTable
ALTER TABLE "public"."Garden" ALTER COLUMN "facing" DROP NOT NULL,
ALTER COLUMN "position" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Yard" ALTER COLUMN "facing" DROP NOT NULL,
ALTER COLUMN "position" DROP NOT NULL;
