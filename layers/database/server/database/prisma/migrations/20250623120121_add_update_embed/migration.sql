-- CreateTable
CREATE TABLE "embeddings" (
    "id" TEXT NOT NULL,
    "vector" vector(3072) NOT NULL,
    "embeddingModel" TEXT NOT NULL DEFAULT 'text-embedding-3-large',
    "listingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "embeddings_listingId_key" ON "embeddings"("listingId");

-- CreateIndex
CREATE INDEX "embeddings_listingId_idx" ON "embeddings"("listingId");

-- AddForeignKey
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
