-- CreateTable
CREATE TABLE "ppd_update_log" (
    "id" SERIAL NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "records_processed" INTEGER NOT NULL,
    "data_hash" TEXT NOT NULL,

    CONSTRAINT "ppd_update_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ppd_update_log_data_hash_key" ON "ppd_update_log"("data_hash");
