-- CreateTable
CREATE TABLE "TrackSearch" (
    "id" SERIAL NOT NULL,
    "aiQuery" TEXT NOT NULL,
    "userId" INTEGER,
    "location" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackSearch_pkey" PRIMARY KEY ("id")
);
