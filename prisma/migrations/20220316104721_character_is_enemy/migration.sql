/*
  Warnings:

  - Added the required column `isEnemy` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "isEnemy" BOOLEAN NOT NULL;
