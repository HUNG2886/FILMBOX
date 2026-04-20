-- Per-episode paid flag replaces series-level `Movie.exclusive` gating.
ALTER TABLE "Episode" ADD COLUMN "paid" BOOLEAN NOT NULL DEFAULT false;

-- Demo-style backfill: legacy SERIES marked exclusive keep ep #1 free and the rest paid,
-- so existing users still see a gated experience after migration.
UPDATE "Episode" AS e
SET "paid" = true
FROM "Movie" AS m
WHERE e."movieId" = m."id"
  AND m."kind" = 'SERIES'
  AND m."exclusive" = true
  AND e."number" > 1;

-- Movie.exclusive no longer gates SERIES — reset it so badges/logic stay coherent.
UPDATE "Movie" SET "exclusive" = false WHERE "kind" = 'SERIES';
