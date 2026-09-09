/*
  Warnings:

  - You are about to drop the column `icon` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "icon";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" JSON,
ADD COLUMN     "company" TEXT;
