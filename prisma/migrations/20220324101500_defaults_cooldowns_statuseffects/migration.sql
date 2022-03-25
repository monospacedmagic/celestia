/*
  Warnings:

  - Made the column `skillCooldowns` on table `Ally` required. This step will fail if there are existing NULL values in that column.
  - Made the column `statusEffects` on table `Ally` required. This step will fail if there are existing NULL values in that column.
  - Made the column `skillCooldowns` on table `Enemy` required. This step will fail if there are existing NULL values in that column.
  - Made the column `statusEffects` on table `Enemy` required. This step will fail if there are existing NULL values in that column.
  - Made the column `playerSkillCooldowns` on table `SoloEncounterState` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ally" ALTER COLUMN "skillCooldowns" SET NOT NULL,
ALTER COLUMN "skillCooldowns" SET DEFAULT '{}',
ALTER COLUMN "statusEffects" SET NOT NULL,
ALTER COLUMN "statusEffects" SET DEFAULT '{}';

-- AlterTable
ALTER TABLE "Enemy" ALTER COLUMN "skillCooldowns" SET NOT NULL,
ALTER COLUMN "skillCooldowns" SET DEFAULT '{}',
ALTER COLUMN "statusEffects" SET NOT NULL,
ALTER COLUMN "statusEffects" SET DEFAULT '{}';

-- AlterTable
ALTER TABLE "SoloEncounterState" ALTER COLUMN "playerSkillCooldowns" SET NOT NULL,
ALTER COLUMN "playerSkillCooldowns" SET DEFAULT '{}';
