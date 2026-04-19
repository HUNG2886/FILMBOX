import { PrismaClient } from "@prisma/client";
import { MOVIE_STATUS } from "../lib/movie-status";
import { validatePasswordStrength } from "../lib/password-policy";
import bcrypt from "bcryptjs";
import {
  featuredCarousel,
  featuredEpisodes,
  recommended,
  trending,
} from "../lib/dramas-static";
import type { Drama } from "../lib/dramas-types";

const prisma = new PrismaClient();

type Flags = {
  showCarousel: boolean;
  showRecommended: boolean;
  showTrending: boolean;
  showHidden: boolean;
};

function emptyFlags(): Flags {
  return {
  showCarousel: false,
  showRecommended: false,
  showTrending: false,
  showHidden: false,
  };
}

function mergeDramas() {
  const map = new Map<
    string,
    { drama: Drama; flags: Flags; shelfOrder: number }
  >();
  let seq = 0;

  const add = (list: Drama[], patch: Partial<Flags>) => {
    for (const d of list) {
      const key = `${d.bookId}::${d.slug}`;
      const cur = map.get(key);
      const nextFlags: Flags = cur
        ? {
            showCarousel: cur.flags.showCarousel || !!patch.showCarousel,
            showRecommended: cur.flags.showRecommended || !!patch.showRecommended,
            showTrending: cur.flags.showTrending || !!patch.showTrending,
            showHidden: cur.flags.showHidden || !!patch.showHidden,
          }
        : {
            ...emptyFlags(),
            showCarousel: !!patch.showCarousel,
            showRecommended: !!patch.showRecommended,
            showTrending: !!patch.showTrending,
            showHidden: !!patch.showHidden,
          };
      map.set(key, {
        drama: d,
        flags: nextFlags,
        shelfOrder: cur?.shelfOrder ?? seq++,
      });
    }
  };

  add(featuredCarousel, { showCarousel: true });
  add(recommended, { showRecommended: true });
  add(trending, { showTrending: true });
  add(featuredEpisodes, { showHidden: true });

  return [...map.values()];
}

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "changeme";

  if (process.env.NODE_ENV === "production") {
    const v = validatePasswordStrength(password);
    if (!v.ok) {
      console.error(
        "ADMIN_PASSWORD does not meet production policy (see lib/password-policy.ts).",
      );
      process.exit(1);
    }
  } else if (password === "changeme") {
    console.warn("[seed] ADMIN_PASSWORD=changeme is for local dev only.");
  }

  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash: hash, role: "admin" },
    update: { passwordHash: hash },
  });

  const merged = mergeDramas();

  for (const { drama: d, flags, shelfOrder } of merged) {
    await prisma.movie.upsert({
      where: {
        bookId_slug: { bookId: d.bookId, slug: d.slug },
      },
      create: {
        bookId: d.bookId,
        slug: d.slug,
        title: d.title,
        synopsis: d.synopsis,
        episodes: d.episodes,
        tag: d.tag ?? null,
        posterSrc: d.posterSrc,
        exclusive: d.exclusive ?? false,
        status: MOVIE_STATUS.PUBLISHED,
        showCarousel: flags.showCarousel,
        showRecommended: flags.showRecommended,
        showTrending: flags.showTrending,
        showHidden: flags.showHidden,
        shelfOrder,
      },
      update: {
        title: d.title,
        synopsis: d.synopsis,
        episodes: d.episodes,
        tag: d.tag ?? null,
        posterSrc: d.posterSrc,
        exclusive: d.exclusive ?? false,
        status: MOVIE_STATUS.PUBLISHED,
        showCarousel: flags.showCarousel,
        showRecommended: flags.showRecommended,
        showTrending: flags.showTrending,
        showHidden: flags.showHidden,
        shelfOrder,
      },
    });
  }

  console.log(`Seeded admin ${email} and ${merged.length} movies.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
