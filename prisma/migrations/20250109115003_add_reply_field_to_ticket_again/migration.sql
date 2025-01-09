/*
  Warnings:

  - You are about to drop the column `reply` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Ticket` ADD COLUMN `reply` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `reply`;
