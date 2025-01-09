-- AddForeignKey
ALTER TABLE `Admin_yonke` ADD CONSTRAINT `Admin_yonke_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin_yonke` ADD CONSTRAINT `Admin_yonke_yonke_id_fkey` FOREIGN KEY (`yonke_id`) REFERENCES `Yonke`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
