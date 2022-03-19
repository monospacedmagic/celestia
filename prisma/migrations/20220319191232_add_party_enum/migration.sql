-- CreateEnum
CREATE TYPE "Party" AS ENUM ('ALLY', 'ENEMY');

-- AlterTable
ALTER TABLE "Ally" ADD COLUMN     "party" "Party" NOT NULL DEFAULT E'ALLY';

-- AlterTable
ALTER TABLE "Enemy" ADD COLUMN     "party" "Party" NOT NULL DEFAULT E'ENEMY';
