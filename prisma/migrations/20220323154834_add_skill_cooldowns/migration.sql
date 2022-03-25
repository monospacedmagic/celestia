/*
  Warnings:

  - Added the required column `skillCooldowns` to the `Ally` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `statusEffects` on the `Ally` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `skillCooldowns` to the `Enemy` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `statusEffects` on the `Enemy` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Ally" ADD COLUMN     "skillCooldowns" JSONB NOT NULL,
DROP COLUMN "statusEffects",
ADD COLUMN     "statusEffects" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Enemy" ADD COLUMN     "skillCooldowns" JSONB NOT NULL,
DROP COLUMN "statusEffects",
ADD COLUMN     "statusEffects" JSONB NOT NULL;
