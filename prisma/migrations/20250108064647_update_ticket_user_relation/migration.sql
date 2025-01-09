/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Ticket` DROP FOREIGN KEY `Ticket_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `Ticket` DROP FOREIGN KEY `Ticket_customerId_fkey`;

-- DropIndex
DROP INDEX `Ticket_adminId_fkey` ON `Ticket`;

-- DropIndex
DROP INDEX `Ticket_customerId_fkey` ON `Ticket`;

-- AlterTable
ALTER TABLE `Ticket` MODIFY `customerId` VARCHAR(191) NOT NULL,
    MODIFY `adminId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `role`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
