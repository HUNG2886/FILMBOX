-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL DEFAULT '',
    "episodes" INTEGER NOT NULL,
    "tag" TEXT,
    "posterSrc" TEXT NOT NULL,
    "exclusive" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "showCarousel" BOOLEAN NOT NULL DEFAULT false,
    "showRecommended" BOOLEAN NOT NULL DEFAULT false,
    "showTrending" BOOLEAN NOT NULL DEFAULT false,
    "showHidden" BOOLEAN NOT NULL DEFAULT false,
    "shelfOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Movie_status_idx" ON "Movie"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_bookId_slug_key" ON "Movie"("bookId", "slug");
