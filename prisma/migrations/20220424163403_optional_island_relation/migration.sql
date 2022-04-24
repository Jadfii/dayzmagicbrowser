/*
  Warnings:

  - You are about to drop the column `islandTerrainId` on the `Server` table. All the data in the column will be lost.
  - Added the required column `island` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Server" DROP CONSTRAINT "Server_islandTerrainId_fkey";

-- AlterTable
ALTER TABLE "Server" DROP COLUMN "islandTerrainId",
ADD COLUMN     "island" TEXT NOT NULL,
ADD COLUMN     "relatedIslandTerrainId" TEXT;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_relatedIslandTerrainId_fkey" FOREIGN KEY ("relatedIslandTerrainId") REFERENCES "Island"("terrainId") ON DELETE SET NULL ON UPDATE CASCADE;
