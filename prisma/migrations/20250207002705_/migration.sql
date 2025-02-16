/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin_yonke" DROP CONSTRAINT "Admin_yonke_admin_id_fkey";

-- AlterTable
ALTER TABLE "Admin_yonke" ALTER COLUMN "admin_id" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Admin";

-- AddForeignKey
ALTER TABLE "Admin_yonke" ADD CONSTRAINT "Admin_yonke_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
