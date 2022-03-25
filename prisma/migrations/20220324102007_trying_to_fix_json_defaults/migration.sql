-- AlterTable
ALTER TABLE "Ally" ALTER COLUMN "skillCooldowns" DROP NOT NULL,
ALTER COLUMN "statusEffects" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Enemy" ALTER COLUMN "skillCooldowns" DROP NOT NULL,
ALTER COLUMN "statusEffects" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SoloEncounterState" ALTER COLUMN "playerSkillCooldowns" DROP NOT NULL;
