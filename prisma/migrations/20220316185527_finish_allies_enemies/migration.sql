/*
  Warnings:

  - You are about to drop the column `encounterName` on the `Ally` table. All the data in the column will be lost.
  - You are about to drop the column `encounterName` on the `Enemy` table. All the data in the column will be lost.
  - You are about to drop the `_AllyToSoloEncounterState` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EnemyToSoloEncounterState` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `encounterStateId` to the `Ally` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encounterStateId` to the `Enemy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ally" DROP CONSTRAINT "Ally_encounterName_fkey";

-- DropForeignKey
ALTER TABLE "Enemy" DROP CONSTRAINT "Enemy_encounterName_fkey";

-- DropForeignKey
ALTER TABLE "_AllyToSoloEncounterState" DROP CONSTRAINT "_AllyToSoloEncounterState_A_fkey";

-- DropForeignKey
ALTER TABLE "_AllyToSoloEncounterState" DROP CONSTRAINT "_AllyToSoloEncounterState_B_fkey";

-- DropForeignKey
ALTER TABLE "_EnemyToSoloEncounterState" DROP CONSTRAINT "_EnemyToSoloEncounterState_A_fkey";

-- DropForeignKey
ALTER TABLE "_EnemyToSoloEncounterState" DROP CONSTRAINT "_EnemyToSoloEncounterState_B_fkey";

-- AlterTable
ALTER TABLE "Ally" DROP COLUMN "encounterName",
ADD COLUMN     "encounterStateId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Enemy" DROP COLUMN "encounterName",
ADD COLUMN     "encounterStateId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_AllyToSoloEncounterState";

-- DropTable
DROP TABLE "_EnemyToSoloEncounterState";

-- AddForeignKey
ALTER TABLE "Ally" ADD CONSTRAINT "Ally_encounterStateId_fkey" FOREIGN KEY ("encounterStateId") REFERENCES "SoloEncounterState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enemy" ADD CONSTRAINT "Enemy_encounterStateId_fkey" FOREIGN KEY ("encounterStateId") REFERENCES "SoloEncounterState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
