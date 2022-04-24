/*
  Warnings:

  - You are about to drop the column `island` on the `Server` table. All the data in the column will be lost.
  - Added the required column `islandTerrainId` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Server" DROP COLUMN "island",
ADD COLUMN     "islandTerrainId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_islandTerrainId_fkey" FOREIGN KEY ("islandTerrainId") REFERENCES "Island"("terrainId") ON DELETE RESTRICT ON UPDATE CASCADE;
