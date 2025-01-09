/*
  Warnings:

  - Added the required column `city` to the `Yonke` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Yonke` ADD COLUMN `city` VARCHAR(191) NOT NULL;
