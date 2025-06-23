/*
  Warnings:

  - You are about to drop the `embeddings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "embeddings" DROP CONSTRAINT "embeddings_listingId_fkey";

-- DropTable
DROP TABLE "embeddings";
