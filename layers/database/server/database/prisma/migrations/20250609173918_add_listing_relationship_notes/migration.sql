-- AddForeignKey
ALTER TABLE "UserNote" ADD CONSTRAINT "UserNote_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
