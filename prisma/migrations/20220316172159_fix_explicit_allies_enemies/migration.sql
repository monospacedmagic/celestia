/*
  Warnings:

  - You are about to drop the column `allyStates` on the `SoloEncounterState` table. All the data in the column will be lost.
  - You are about to drop the column `enemyStates` on the `SoloEncounterState` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Ally_characterId_encounterName_key";

-- DropIndex
DROP INDEX "Enemy_characterId_encounterName_key";

-- AlterTable
ALTER TABLE "Ally" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Ally_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Enemy" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Enemy_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SoloEncounterState" DROP COLUMN "allyStates",
DROP COLUMN "enemyStates",
ADD COLUMN     "allyIDs" INTEGER[],
ADD COLUMN     "enemyIDs" INTEGER[];

-- CreateTable
CREATE TABLE "_AllyToSoloEncounterState" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EnemyToSoloEncounterState" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AllyToSoloEncounterState_AB_unique" ON "_AllyToSoloEncounterState"("A", "B");

-- CreateIndex
CREATE INDEX "_AllyToSoloEncounterState_B_index" ON "_AllyToSoloEncounterState"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EnemyToSoloEncounterState_AB_unique" ON "_EnemyToSoloEncounterState"("A", "B");

-- CreateIndex
CREATE INDEX "_EnemyToSoloEncounterState_B_index" ON "_EnemyToSoloEncounterState"("B");

-- AddForeignKey
ALTER TABLE "_AllyToSoloEncounterState" ADD FOREIGN KEY ("A") REFERENCES "Ally"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllyToSoloEncounterState" ADD FOREIGN KEY ("B") REFERENCES "SoloEncounterState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnemyToSoloEncounterState" ADD FOREIGN KEY ("A") REFERENCES "Enemy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnemyToSoloEncounterState" ADD FOREIGN KEY ("B") REFERENCES "SoloEncounterState"("id") ON DELETE CASCADE ON UPDATE CASCADE;
