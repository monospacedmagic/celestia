-- CreateEnum
CREATE TYPE "WeaponType" AS ENUM ('SWORD', 'CLAYMORE', 'POLEARM', 'BOW', 'CATALYST');

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "weaponType" "WeaponType";
