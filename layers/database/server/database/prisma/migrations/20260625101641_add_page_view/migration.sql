-- AlterTable
ALTER TABLE "OwnershipVerification" ALTER COLUMN "reviewTokenExpiry" SET DEFAULT NOW() + INTERVAL '30 days';

-- CreateTable
CREATE TABLE "PageView" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "sessionId" TEXT,
    "path" TEXT NOT NULL,
    "fullPath" TEXT NOT NULL,
    "title" TEXT,
    "routeName" TEXT,
    "referrer" TEXT,
    "source" TEXT,
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_userId_idx" ON "PageView"("userId");

-- CreateIndex
CREATE INDEX "PageView_sessionId_idx" ON "PageView"("sessionId");

-- CreateIndex
CREATE INDEX "PageView_path_idx" ON "PageView"("path");

-- CreateIndex
CREATE INDEX "PageView_routeName_idx" ON "PageView"("routeName");

-- CreateIndex
CREATE INDEX "PageView_source_idx" ON "PageView"("source");

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
