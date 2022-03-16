-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "energy" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "energy" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "skills" TEXT[];

-- AlterTable
ALTER TABLE "SoloEncounterState" ALTER COLUMN "isComplete" SET DEFAULT false;

-- CreateTable
CREATE TABLE "Ally" (
    "characterId" INTEGER NOT NULL,
    "encounterName" TEXT NOT NULL,
    "hp" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,
    "afflictions" "Affliction"[]
);

-- CreateTable
CREATE TABLE "Enemy" (
    "characterId" INTEGER NOT NULL,
    "encounterName" TEXT NOT NULL,
    "hp" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,
    "afflictions" "Affliction"[]
);

-- CreateIndex
CREATE UNIQUE INDEX "Ally_characterId_encounterName_key" ON "Ally"("characterId", "encounterName");

-- CreateIndex
CREATE UNIQUE INDEX "Enemy_characterId_encounterName_key" ON "Enemy"("characterId", "encounterName");

-- AddForeignKey
ALTER TABLE "Ally" ADD CONSTRAINT "Ally_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ally" ADD CONSTRAINT "Ally_encounterName_fkey" FOREIGN KEY ("encounterName") REFERENCES "Encounter"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enemy" ADD CONSTRAINT "Enemy_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enemy" ADD CONSTRAINT "Enemy_encounterName_fkey" FOREIGN KEY ("encounterName") REFERENCES "Encounter"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
