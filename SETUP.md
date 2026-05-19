# B-Marvels Digital — Setup Guide

## First-time setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in your values
cp .env.example .env
```

Edit `.env` and set:
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32` in your terminal to generate one
- `ADMIN_EMAIL` — the email you'll use to log into the CMS
- `ADMIN_PASSWORD` — your CMS password (plain text is fine locally; in production, replace with a bcrypt hash)

```bash
# 3. Create the database and run migrations
npm run db:push

# 4. Seed the database with 3 starter blog posts
npm run db:seed

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## CMS Admin

Go to [http://localhost:3000/admin](http://localhost:3000/admin).

Log in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from your `.env`.

From the admin you can:
- Create and publish blog posts with the Tiptap rich-text editor
- Edit or unpublish existing posts
- Preview posts live on the site

---

## Project structure

```
src/
  app/
    page.tsx              ← Homepage (Server Component, fetches blog posts)
    layout.tsx            ← Root layout (fonts, global.less, SEO metadata)
    not-found.tsx         ← 404 page
    blog/
      page.tsx            ← Blog index
      [slug]/page.tsx     ← Individual post
    admin/
      page.tsx            ← CMS dashboard
      login/page.tsx      ← Login page
      posts/              ← Post list, new post, edit post
    api/
      auth/               ← NextAuth handler
      posts/              ← REST API for post CRUD
  components/
    Navigation/           ← Sticky nav (client component, scroll-aware)
    Hero/                 ← Dark full-height hero section
    Services/             ← 4 service cards
    Portfolio/            ← 6 project showcase cards
    Process/              ← 4-step process timeline
    About/                ← Freelancer advantages
    BlogPreview/          ← Latest 3 posts (shown on homepage if DB has posts)
    Contact/              ← Contact section with email link + availability
    Footer/               ← Site footer
    admin/PostEditor/     ← Tiptap WYSIWYG editor used in CMS
  data/
    portfolio.ts          ← Portfolio project data (edit this to update projects)
  lib/
    auth.ts               ← NextAuth configuration
    prisma.ts             ← Prisma client singleton
  styles/
    global.less           ← All design tokens (colors, spacing, typography, etc.)
                             Import in component .less files with: @import (reference) "global";
prisma/
  schema.prisma           ← SQLite database schema (Post model)
  seed.ts                 ← Starter blog posts seeder
```

---

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm run start` | Start production server |
| `npm run db:push` | Apply schema changes to the database (no migration history) |
| `npm run db:migrate` | Create a migration and apply it |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:seed` | Seed the database with starter blog posts |

---

## Styling conventions

All component styles use LESS with BEM naming. Every component `.less` file starts with:

```less
@import (reference) "global";
```

This imports all design tokens (colors, spacing, fonts, etc.) without duplicating the CSS output. Use the variables — never hardcode values.

---

## Deploying to Vercel

1. Push the repo to GitHub
2. Import it in Vercel
3. Set all `.env` variables in the Vercel dashboard under Settings → Environment Variables
4. For the database in production, switch `DATABASE_URL` to a hosted Postgres instance (e.g., Neon, Supabase) and update `prisma/schema.prisma` to use `provider = "postgresql"`

---

## Customising content

- **Portfolio projects** → `src/data/portfolio.ts`
- **Services** → `src/components/Services/Services.tsx`
- **Process steps** → `src/components/Process/Process.tsx`
- **About copy** → `src/components/About/About.tsx`
- **Contact email** → `src/components/Contact/Contact.tsx`
- **Design tokens** → `src/styles/global.less`
- **Global SEO metadata** → `src/app/layout.tsx`
