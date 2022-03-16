-- CreateEnum
CREATE TYPE "Affliction" AS ENUM ('PYRO', 'CRYO', 'ELECTRO', 'HYDRO');

-- AlterEnum
ALTER TYPE "Element" ADD VALUE 'NONE';

-- AlterEnum
ALTER TYPE "WeaponType" ADD VALUE 'NONE';

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "element" "Element" NOT NULL,
    "weaponType" "WeaponType" NOT NULL,
    "maxHP" INTEGER NOT NULL,
    "skills" TEXT[],
    "defaultAfflictions" "Affliction"[],
    "ownerId" BIGINT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encounter" (
    "name" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,

    CONSTRAINT "Encounter_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "SoloEncounterState" (
    "id" SERIAL NOT NULL,
    "encounterName" TEXT NOT NULL,
    "playerId" BIGINT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "allyStates" JSONB NOT NULL,
    "enemyStates" JSONB NOT NULL,
    "isComplete" BOOLEAN NOT NULL,

    CONSTRAINT "SoloEncounterState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CharacterToEncounter" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterToEncounter_AB_unique" ON "_CharacterToEncounter"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterToEncounter_B_index" ON "_CharacterToEncounter"("B");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Player"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloEncounterState" ADD CONSTRAINT "SoloEncounterState_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloEncounterState" ADD CONSTRAINT "SoloEncounterState_encounterName_fkey" FOREIGN KEY ("encounterName") REFERENCES "Encounter"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToEncounter" ADD FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToEncounter" ADD FOREIGN KEY ("B") REFERENCES "Encounter"("name") ON DELETE CASCADE ON UPDATE CASCADE;
