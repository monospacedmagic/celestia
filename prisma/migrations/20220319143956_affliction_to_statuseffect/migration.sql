/*
  Warnings:

  - You are about to drop the column `afflictions` on the `Ally` table. All the data in the column will be lost.
  - You are about to drop the column `defaultAfflictions` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `afflictions` on the `Enemy` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusEffect" AS ENUM ('PYRO', 'CRYO', 'ELECTRO', 'HYDRO');

-- AlterTable
ALTER TABLE "Ally" DROP COLUMN "afflictions",
ADD COLUMN     "statusEffects" "StatusEffect"[];

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "defaultAfflictions",
ADD COLUMN     "defaultStatusEffects" "StatusEffect"[];

-- AlterTable
ALTER TABLE "Enemy" DROP COLUMN "afflictions",
ADD COLUMN     "statusEffects" "StatusEffect"[];

-- DropEnum
DROP TYPE "Affliction";
