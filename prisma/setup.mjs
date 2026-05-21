import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setup() {
  // Create table if it doesn't exist
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "posts" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "title" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "excerpt" TEXT NOT NULL,
      "body" TEXT NOT NULL,
      "coverImage" TEXT,
      "published" BOOLEAN NOT NULL DEFAULT false,
      "publishedAt" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      "author" TEXT NOT NULL DEFAULT 'Peter Lehocky',
      "titleSk" TEXT,
      "slugSk" TEXT,
      "excerptSk" TEXT,
      "bodySk" TEXT
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "posts_slug_key" ON "posts"("slug")
  `);

  console.log('✓ Database schema ready');

  // Seed only if empty
  const count = await prisma.post.count();
  if (count > 0) {
    console.log(`✓ Database already has ${count} posts, skipping seed`);
    return;
  }

  const posts = [
    {
      title: 'Why Your Website Speed Is Losing You Customers (And How to Fix It)',
      slug: 'website-speed-losing-customers',
      excerpt: 'A one-second delay in page load time can reduce conversions by 7%.',
      body: '<h2>The Silent Revenue Killer</h2><p>Your website can look stunning and still be bleeding customers every single day.</p>',
      published: true,
      publishedAt: new Date('2024-11-10'),
      updatedAt: new Date(),
      titleSk: 'Prečo rýchlosť webu prichádza o zákazníkov',
      slugSk: 'rychlost-webu-strata-zakaznikov',
      excerptSk: 'Sekundové oneskorenie načítania stránky môže znížiť konverzie o 7 %.',
      bodySk:
        '<h2>Tichý zabijak príjmov</h2><p>Váš web môže vyzerať skvele a napriek tomu každý deň prichádzať o zákazníkov.</p>',
    },
    {
      title: 'Mobile-First Is Not Optional',
      slug: 'mobile-first-website-mistakes',
      excerpt: 'Over 60% of your website traffic is on mobile.',
      body: "<h2>The Numbers Don't Lie</h2><p>Mobile now accounts for between 55% and 70% of web traffic.</p>",
      published: true,
      publishedAt: new Date('2024-12-03'),
      updatedAt: new Date(),
      titleSk: 'Mobile-first nie je voliteľné',
      slugSk: 'mobile-first-chyby-webov',
      excerptSk: 'Viac ako 60 % návštevnosti vášho webu pochádza z mobilu.',
      bodySk:
        '<h2>Čísla neklamú</h2><p>Mobilné zariadenia tvoria 55–70 % webovej návštevnosti.</p>',
    },
    {
      title: 'The 5 Things Your Website Is Probably Missing',
      slug: 'website-missing-essentials',
      excerpt: 'Five technical elements most small business websites are missing.',
      body: '<h2>When "Good Enough" Isn\'t</h2><p>Most websites are missing foundational elements that limit their effectiveness.</p>',
      published: true,
      publishedAt: new Date('2025-01-21'),
      updatedAt: new Date(),
      titleSk: '5 vecí, ktoré váš web pravdepodobne nemá',
      slugSk: 'co-chyba-vasmu-webu',
      excerptSk: 'Päť technických prvkov, ktoré väčšina webov malých podnikov postrádá.',
      bodySk:
        '<h2>Keď "dosť dobré" nestačí</h2><p>Väčšina webov chýba základné prvky, ktoré ticho obmedzujú ich efektivitu.</p>',
    },
  ];

  for (const post of posts) {
    await prisma.post.create({ data: post });
    console.log(`✓ Seeded: "${post.title}"`);
  }

  console.log('✓ Seed complete');
}

setup()
  .catch((e) => {
    console.error('Setup error:', e);
  })
  .finally(() => prisma.$disconnect());
