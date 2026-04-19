This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database

Use **PostgreSQL** (local Docker, or [Neon](https://neon.tech) for dev/prod). Set `DATABASE_URL` in `.env` to a connection string starting with `postgresql://` or `postgres://`. Then:

```bash
npx prisma migrate deploy
npx prisma db seed   # optional: admin user + demo movies
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Import the GitHub repo in [Vercel](https://vercel.com/new). Set **Environment Variables** (Project → Settings):

- `DATABASE_URL` — use a hosted **PostgreSQL** URL (e.g. [Neon](https://neon.tech)); SQLite files are not suitable for Vercel’s runtime. After switching the Prisma datasource to `postgresql`, run migrations against that database.
- `AUTH_SECRET` — long random string (production).
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — for `prisma db seed` if you seed the production DB once.

`npm run build` runs `prisma migrate deploy` first — set **`DATABASE_URL` on Vercel for Production (and Preview if you deploy previews)** so builds can apply migrations. Marketing/admin use `dynamic = "force-dynamic"` for request-time rendering.

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
