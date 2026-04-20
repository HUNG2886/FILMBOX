-- AlterTable
ALTER TABLE "Movie"
ADD COLUMN "kind" TEXT NOT NULL DEFAULT 'SINGLE';

-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT,
    "thumbnail" TEXT,
    "playbackType" TEXT,
    "playbackUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Episode_movieId_idx" ON "Episode"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_movieId_number_key" ON "Episode"("movieId", "number");

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
