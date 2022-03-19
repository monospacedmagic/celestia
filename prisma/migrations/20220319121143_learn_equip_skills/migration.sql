/*
  Warnings:

  - You are about to drop the column `skills` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `Player` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SkillSlot" AS ENUM ('PRIMARY', 'SECONDARY', 'TERTIARY', 'EXTRA', 'SPECIAL');

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "skills";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "skills";

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

-- AddForeignKey
ALTER TABLE "PlayerLearnedSkill" ADD CONSTRAINT "PlayerLearnedSkill_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerLearnedSkill" ADD CONSTRAINT "PlayerLearnedSkill_skillName_fkey" FOREIGN KEY ("skillName") REFERENCES "LearnedSkill"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterLearnedSkill" ADD CONSTRAINT "CharacterLearnedSkill_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterLearnedSkill" ADD CONSTRAINT "CharacterLearnedSkill_skillName_fkey" FOREIGN KEY ("skillName") REFERENCES "LearnedSkill"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
