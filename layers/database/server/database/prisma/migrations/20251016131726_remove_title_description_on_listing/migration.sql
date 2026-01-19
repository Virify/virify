/*
  Warnings:

  - You are about to drop the column `description` on the `DraftListing` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `DraftListing` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."DraftListing" DROP COLUMN "description",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "public"."Listing" DROP COLUMN "description",
DROP COLUMN "title";
