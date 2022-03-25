/*
  Warnings:

  - Added the required column `playerSkillCooldowns` to the `SoloEncounterState` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SoloEncounterState" ADD COLUMN     "playerSkillCooldowns" JSONB NOT NULL;
