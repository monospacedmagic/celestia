-- CreateEnum
CREATE TYPE "Element" AS ENUM ('PYRO', 'GEO', 'DENDRO', 'CRYO', 'ELECTRO', 'ANEMO', 'HYDRO');

-- CreateTable
CREATE TABLE "Player" (
    "userId" BIGINT NOT NULL,
    "element" "Element",

    CONSTRAINT "Player_pkey" PRIMARY KEY ("userId")
);
