/*
  Warnings:

  - Added the required column `link` to the `Bookmarks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bookmarks" ADD COLUMN     "link" TEXT NOT NULL;
