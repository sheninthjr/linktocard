/*
  Warnings:

  - Added the required column `type` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('YOUTUBE', 'LINKEDIN', 'GITHUB');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "type" "Type" NOT NULL;
