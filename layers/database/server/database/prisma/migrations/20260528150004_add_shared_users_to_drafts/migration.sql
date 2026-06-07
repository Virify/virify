-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "description" SET DEFAULT '';

-- CreateTable
CREATE TABLE "_DraftListingSharedUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DraftListingSharedUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DraftListingSharedUsers_B_index" ON "_DraftListingSharedUsers"("B");

-- AddForeignKey
ALTER TABLE "_DraftListingSharedUsers" ADD CONSTRAINT "_DraftListingSharedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "DraftListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DraftListingSharedUsers" ADD CONSTRAINT "_DraftListingSharedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
