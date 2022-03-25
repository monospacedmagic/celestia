-- CreateEnum
CREATE TYPE "Element" AS ENUM ('NONE', 'PYRO', 'GEO', 'DENDRO', 'CRYO', 'ELECTRO', 'ANEMO', 'HYDRO');

-- CreateEnum
CREATE TYPE "WeaponType" AS ENUM ('NONE', 'SWORD', 'CLAYMORE', 'POLEARM', 'BOW', 'CATALYST');

-- CreateEnum
CREATE TYPE "Party" AS ENUM ('ALLY', 'ENEMY');

-- CreateEnum
CREATE TYPE "SkillSlot" AS ENUM ('PRIMARY', 'SECONDARY', 'TERTIARY', 'EXTRA', 'SPECIAL');

-- CreateTable
CREATE TABLE "Player" (
    "userId" BIGINT NOT NULL,
    "element" "Element",
    "weaponType" "WeaponType",
    "energy" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "isEnemy" BOOLEAN NOT NULL,
    "element" "Element" NOT NULL,
    "weaponType" "WeaponType" NOT NULL,
    "maxHp" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL DEFAULT 0,
    "defaultStatusEffects" JSONB NOT NULL,
    "ownerId" BIGINT,
    "isDeployed" BOOLEAN NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnedSkill" (
    "name" TEXT NOT NULL,

    CONSTRAINT "LearnedSkill_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "PlayerLearnedSkill" (
    "playerId" BIGINT NOT NULL,
    "skillName" TEXT NOT NULL,
    "equippedIn" "SkillSlot",

    CONSTRAINT "PlayerLearnedSkill_pkey" PRIMARY KEY ("playerId","skillName")
);

-- CreateTable
CREATE TABLE "CharacterLearnedSkill" (
    "characterId" INTEGER NOT NULL,
    "skillName" TEXT NOT NULL,
    "equippedIn" "SkillSlot",

    CONSTRAINT "CharacterLearnedSkill_pkey" PRIMARY KEY ("characterId","skillName")
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
    "messageId" BIGINT,
    "encounterName" TEXT NOT NULL,
    "playerId" BIGINT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "allyIDs" INTEGER[],
    "enemyIDs" INTEGER[],
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "playerSkillCooldowns" JSONB DEFAULT '{}',

    CONSTRAINT "SoloEncounterState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ally" (
    "id" SERIAL NOT NULL,
    "party" "Party" NOT NULL DEFAULT E'ALLY',
    "characterId" INTEGER NOT NULL,
    "encounterStateId" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,
    "statusEffects" JSONB DEFAULT '{}',
    "skillCooldowns" JSONB DEFAULT '{}',

    CONSTRAINT "Ally_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enemy" (
    "id" SERIAL NOT NULL,
    "party" "Party" NOT NULL DEFAULT E'ENEMY',
    "characterId" INTEGER NOT NULL,
    "encounterStateId" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,
    "statusEffects" JSONB DEFAULT '{}',
    "skillCooldowns" JSONB DEFAULT '{}',

    CONSTRAINT "Enemy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CharacterToEncounter" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SoloEncounterState_messageId_key" ON "SoloEncounterState"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterToEncounter_AB_unique" ON "_CharacterToEncounter"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterToEncounter_B_index" ON "_CharacterToEncounter"("B");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Player"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerLearnedSkill" ADD CONSTRAINT "PlayerLearnedSkill_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerLearnedSkill" ADD CONSTRAINT "PlayerLearnedSkill_skillName_fkey" FOREIGN KEY ("skillName") REFERENCES "LearnedSkill"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterLearnedSkill" ADD CONSTRAINT "CharacterLearnedSkill_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterLearnedSkill" ADD CONSTRAINT "CharacterLearnedSkill_skillName_fkey" FOREIGN KEY ("skillName") REFERENCES "LearnedSkill"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloEncounterState" ADD CONSTRAINT "SoloEncounterState_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloEncounterState" ADD CONSTRAINT "SoloEncounterState_encounterName_fkey" FOREIGN KEY ("encounterName") REFERENCES "Encounter"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ally" ADD CONSTRAINT "Ally_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ally" ADD CONSTRAINT "Ally_encounterStateId_fkey" FOREIGN KEY ("encounterStateId") REFERENCES "SoloEncounterState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enemy" ADD CONSTRAINT "Enemy_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enemy" ADD CONSTRAINT "Enemy_encounterStateId_fkey" FOREIGN KEY ("encounterStateId") REFERENCES "SoloEncounterState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToEncounter" ADD FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToEncounter" ADD FOREIGN KEY ("B") REFERENCES "Encounter"("name") ON DELETE CASCADE ON UPDATE CASCADE;
