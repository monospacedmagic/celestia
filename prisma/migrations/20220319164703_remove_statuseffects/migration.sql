/*
  Warnings:

  - The `statusEffects` column on the `Ally` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `defaultStatusEffects` column on the `Character` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `statusEffects` column on the `Enemy` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Ally" DROP COLUMN "statusEffects",
ADD COLUMN     "statusEffects" TEXT[];

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "defaultStatusEffects",
ADD COLUMN     "defaultStatusEffects" TEXT[];

-- AlterTable
ALTER TABLE "Enemy" DROP COLUMN "statusEffects",
ADD COLUMN     "statusEffects" TEXT[];

-- DropEnum
DROP TYPE "StatusEffect";
