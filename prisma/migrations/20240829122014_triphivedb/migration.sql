/*
  Warnings:

  - You are about to drop the column `schema` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `BlogPost` table. All the data in the column will be lost.
  - Added the required column `author` to the `BlogPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "schema",
DROP COLUMN "updatedAt",
ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "category" TEXT[],
ADD COLUMN     "image" TEXT NOT NULL;
