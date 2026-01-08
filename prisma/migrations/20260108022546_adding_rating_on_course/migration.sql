-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "numberOfRate" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "thumbnailUrl" SET DEFAULT '/thumbnail.jpeg';

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "corpStatus" DROP DEFAULT;
