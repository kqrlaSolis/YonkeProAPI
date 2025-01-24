-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin_yonke" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "yonke_id" INTEGER NOT NULL,

    CONSTRAINT "Admin_yonke_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Yonke" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Yonke_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Admin_yonke" ADD CONSTRAINT "Admin_yonke_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin_yonke" ADD CONSTRAINT "Admin_yonke_yonke_id_fkey" FOREIGN KEY ("yonke_id") REFERENCES "Yonke"("id") ON DELETE CASCADE ON UPDATE CASCADE;
