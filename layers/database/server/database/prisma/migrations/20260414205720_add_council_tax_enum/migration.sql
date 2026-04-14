/*
  Warnings:

  - Changed the type of `councilTaxBand` on the `RunningCosts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CouncilTaxBand" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H');

-- AlterTable
ALTER TABLE "RunningCosts" DROP COLUMN "councilTaxBand",
ADD COLUMN     "councilTaxBand" "CouncilTaxBand" NOT NULL;
