/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `SoloEncounterState` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SoloEncounterState" ADD COLUMN     "messageId" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "SoloEncounterState_messageId_key" ON "SoloEncounterState"("messageId");
