-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "cities" TEXT[],
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "pieceName" TEXT NOT NULL,
    "carBrand" TEXT NOT NULL,
    "carModelYear" TEXT NOT NULL,
    "carEngine" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
