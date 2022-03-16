/*
  Warnings:

  - You are about to drop the column `maxHP` on the `Character` table. All the data in the column will be lost.
  - Added the required column `isDeployed` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxHp` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SkillSlot" AS ENUM ('PRIMARY', 'SECONDARY', 'TERTIARY', 'EXTRA', 'SPECIAL');

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "maxHP",
ADD COLUMN     "isDeployed" BOOLEAN NOT NULL,
ADD COLUMN     "maxHp" INTEGER NOT NULL;
