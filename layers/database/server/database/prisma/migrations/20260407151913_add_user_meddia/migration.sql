-- CreateEnum
CREATE TYPE "UserMediaType" AS ENUM ('IMAGE', 'PDF', 'DOCUMENT', 'SPREADSHEET', 'OTHER');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "userMediaId" INTEGER,
ALTER COLUMN "content" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserMedia" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "mediaType" "UserMediaType" NOT NULL,
    "mimeType" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMedia_key_key" ON "UserMedia"("key");

-- CreateIndex
CREATE INDEX "UserMedia_userId_idx" ON "UserMedia"("userId");

-- CreateIndex
CREATE INDEX "Message_userMediaId_idx" ON "Message"("userMediaId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userMediaId_fkey" FOREIGN KEY ("userMediaId") REFERENCES "UserMedia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMedia" ADD CONSTRAINT "UserMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
