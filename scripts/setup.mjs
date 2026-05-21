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
      coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
      excerpt:
        "A one-second delay in page load time can reduce conversions by 7%. Learn why speed matters more than ever in 2024, what's slowing your site down, and the concrete steps to fix it.",
      published: true,
      publishedAt: new Date('2024-11-10'),
      updatedAt: new Date(),
      author: 'Peter Lehocky',
      body: `<h2>The Silent Revenue Killer</h2>
<p>Your website can look stunning — beautiful photography, polished copy, a clear call to action — and still be bleeding customers every single day. The culprit? Speed. Or rather, the lack of it.</p>
<p>Google's data shows that as page load time goes from one second to three seconds, the probability of bounce increases by 32%. Go from one second to five seconds, and that number jumps to 90%. These aren't edge cases or technical edge users. These are your real customers, on their real phones, deciding in milliseconds whether your business is worth their time.</p>

<img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80" alt="Code on a monitor — web performance optimisation" />

<h2>What Google Actually Measures</h2>
<p>Since 2021, Google has used Core Web Vitals as a direct ranking factor. There are three key metrics you need to understand:</p>
<ul>
  <li><strong>LCP (Largest Contentful Paint):</strong> How quickly does the main content of your page appear? Google's target is under 2.5 seconds.</li>
  <li><strong>FID / INP (Interaction to Next Paint):</strong> How quickly does your page respond to user interactions like clicks and taps? Target is under 200ms.</li>
  <li><strong>CLS (Cumulative Layout Shift):</strong> Does your page jump around as it loads, accidentally making users click the wrong thing? Target is a score below 0.1.</li>
</ul>
<p>The uncomfortable truth: most small business websites fail all three. Not because the businesses are bad — but because the developer who built them never thought about performance.</p>

<h2>The Most Common Culprits</h2>
<p>After auditing dozens of websites, the same issues appear over and over again. <strong>Unoptimised images</strong> are the number one offender. A product photo taken on a modern camera can be 6–12 MB. Properly compressed and formatted as WebP, the same image should be under 200 KB. Here's how to convert an image in the terminal:</p>

<pre><code class="language-bash"># Convert a PNG to WebP with quality 80 using cwebp
cwebp -q 80 photo.png -o photo.webp

# Or use ImageMagick to resize AND convert
magick photo.jpg -resize 1200x -quality 80 photo.webp</code></pre>

<p><strong>Render-blocking JavaScript</strong> is when scripts are loaded synchronously in the <code>&lt;head&gt;</code>, preventing the browser from rendering anything until the script has downloaded and executed. The fix is simple:</p>

<pre><code class="language-html">&lt;!-- ❌ Blocks rendering — loads synchronously --&gt;
&lt;script src="/analytics.js"&gt;&lt;/script&gt;

&lt;!-- ✅ Deferred — doesn't block rendering --&gt;
&lt;script src="/analytics.js" defer&gt;&lt;/script&gt;

&lt;!-- ✅ Async — also non-blocking, fires as soon as downloaded --&gt;
&lt;script src="/third-party-widget.js" async&gt;&lt;/script&gt;</code></pre>

<p><strong>No caching strategy</strong> means every visitor downloads everything from scratch, every time. Here's a production-ready Nginx cache configuration:</p>

<pre><code class="language-nginx"># Cache static assets for 1 year
location ~* \\.(jpg|jpeg|png|gif|webp|svg|ico|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Cache CSS/JS for 1 year (use content hashes in filenames!)
location ~* \\.(css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Never cache HTML — always serve fresh
location ~* \\.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}</code></pre>

<h2>The Business Impact Is Real</h2>
<p>Walmart ran a study showing that every 1 second of improvement in load time resulted in a 2% increase in conversions. Amazon estimated that a 100 ms delay cost them 1% in sales. Even for a small business doing €50,000 a year in online revenue, a 2% conversion improvement is €1,000 — more than enough to justify a proper performance audit.</p>

<img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80" alt="Analytics dashboard showing conversion metrics" />

<h2>What You Can Do Right Now</h2>
<p>Run your site through Google PageSpeed Insights (<code>pagespeed.web.dev</code>) and look at your score for both mobile and desktop. If your mobile score is below 70, you have a problem worth addressing. Below 50, it's urgent.</p>
<p>Then look at the "Opportunities" section. PageSpeed will tell you specifically which images aren't optimised, which scripts are render-blocking, and what the estimated time savings would be for each fix.</p>

<h2>Performance Is Not Optional</h2>
<p>The web has matured. Users expect pages to load in under two seconds. Google rewards fast sites and penalises slow ones. And every second of delay is a direct hit to your revenue and your reputation.</p>
<p>When I build a website, performance isn't a feature I add at the end. It's a constraint I design around from the beginning. Images are sized correctly, JavaScript is loaded asynchronously, fonts are preloaded, caching is configured on day one. That's what separates a professional build from one that looks good in a screenshot but fails in the real world.</p>`,

      titleSk: 'Prečo rýchlosť webu prichádza o zákazníkov (a ako to opraviť)',
      slugSk: 'rychlost-webu-strata-zakaznikov',
      excerptSk:
        'Sekundové oneskorenie načítania stránky môže znížiť konverzie o 7 %. Zistite, prečo je rýchlosť dôležitejšia ako kedykoľvek predtým, čo spomaľuje váš web a konkrétne kroky na nápravu.',
      bodySk: `<h2>Tichý zabijak príjmov</h2>
<p>Váš web môže vyzerať skvele — krásne fotografie, vypracovaný text, jasná výzva na akciu — a napriek tomu každý deň prichádzať o zákazníkov. Vinník? Rýchlosť. Alebo skôr jej nedostatok.</p>
<p>Údaje Googlu ukazujú, že keď sa čas načítania stránky predĺži z jednej sekundy na tri, pravdepodobnosť okamžitého odchodu návštevníka stúpne o 32 %. Z jednej sekundy na päť sekúnd toto číslo vyskočí až na 90 %. To nie sú výnimočné prípady — sú to vaši skutoční zákazníci, na svojich telefónoch, ktorí sa v milisekundách rozhodujú, či váš biznis stojí za ich čas.</p>

<img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80" alt="Kód na monitore — optimalizácia výkonu webu" />

<h2>Čo Google skutočne meria</h2>
<p>Od roku 2021 Google používa Core Web Vitals ako priamy faktor hodnotenia. Existujú tri kľúčové metriky, ktoré musíte poznať:</p>
<ul>
  <li><strong>LCP (Largest Contentful Paint):</strong> Ako rýchlo sa zobrazí hlavný obsah vašej stránky? Cieľ Googlu je pod 2,5 sekundy.</li>
  <li><strong>INP (Interaction to Next Paint):</strong> Ako rýchlo reaguje vaša stránka na interakcie používateľa? Cieľ je pod 200 ms.</li>
  <li><strong>CLS (Cumulative Layout Shift):</strong> Skáče vaša stránka pri načítaní? Cieľ je skóre pod 0,1.</li>
</ul>
<p>Nepríjemná pravda: väčšina webov malých podnikov zlyháva vo všetkých troch. Nie preto, že by boli biznisy zlé — ale preto, že vývojár, ktorý ich postavil, o výkone vôbec nepremýšľal.</p>

<h2>Najčastejší vinníci</h2>
<p>Po auditovaní desiatok webov sa stále objavujú rovnaké problémy. <strong>Neoptimalizované obrázky</strong> sú vinníkmi číslo jeden. Fotografiu z moderného fotoaparátu môže mať 6–12 MB. Správne komprimovaná a vo formáte WebP by tá istá fotografia mala mať pod 200 KB. Takto konvertovať obrázok v termináli:</p>

<pre><code class="language-bash"># Konverzia PNG na WebP s kvalitou 80 pomocou cwebp
cwebp -q 80 foto.png -o foto.webp

# Alebo pomocou ImageMagick — zmenšiť aj konvertovať
magick foto.jpg -resize 1200x -quality 80 foto.webp</code></pre>

<p><strong>Blokujúci JavaScript</strong> je načítaný synchrónne v <code>&lt;head&gt;</code> a bráni prehliadaču vykresliť čokoľvek, kým sa skript nestiahne a nespustí. Riešenie je jednoduché:</p>

<pre><code class="language-html">&lt;!-- ❌ Blokuje vykresľovanie — načíta sa synchrónne --&gt;
&lt;script src="/analytics.js"&gt;&lt;/script&gt;

&lt;!-- ✅ Odložené — neblokuje vykresľovanie --&gt;
&lt;script src="/analytics.js" defer&gt;&lt;/script&gt;

&lt;!-- ✅ Asynchrónne — nespúšťa sa oneskorene, ale neblokuje --&gt;
&lt;script src="/widget.js" async&gt;&lt;/script&gt;</code></pre>

<h2>Obchodný dopad je reálny</h2>
<p>Walmart v štúdii zistil, že každé zlepšenie o 1 sekundu zvýšilo konverzie o 2 %. Amazon odhadol, že oneskorenie 100 ms ich stálo 1 % predajov. Aj pre malý biznis s ročnými online príjmami 50 000 € je 2% zlepšenie konverzií 1 000 € — dosť na to, aby sa oplatil poriadny výkonnostný audit.</p>

<img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80" alt="Analytický dashboard zobrazujúci metriky konverzií" />

<h2>Čo môžete urobiť hneď teraz</h2>
<p>Spustite váš web cez Google PageSpeed Insights (<code>pagespeed.web.dev</code>) a pozrite sa na skóre pre mobil aj desktop. Ak je skóre pre mobil pod 70, máte problém, ktorý sa oplatí riešiť. Pod 50 je to urgentné.</p>

<h2>Výkon nie je voliteľný</h2>
<p>Web dozrel. Používatelia očakávajú načítanie stránky do dvoch sekúnd. Google odmeňuje rýchle weby a trestá pomalé. A každá sekunda oneskorenia je priamy zásah do vašich príjmov a reputácie.</p>
<p>Keď staviam web, výkon nie je funkcia, ktorú pridám na konci. Je to obmedzenie, okolo ktorého navrhujem od začiatku. Obrázky sú správne veľké, JavaScript sa načítava asynchrónne, fonty sú prednahrané, cache je nakonfigurované od prvého dňa. To je to, čo odlišuje profesionálny web od jedného, ktorý vyzerá dobre na screenshote, ale zlyháva v reálnom svete.</p>`,
    },
    {
      title: 'Mobile-First Is Not Optional: What Most Websites Get Wrong About Small Screens',
      slug: 'mobile-first-website-mistakes',
      coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
      excerpt:
        "Over 60% of your website traffic is on mobile. Yet most small business sites are designed for desktop and 'adapted' for phone — and the difference shows. Here's what a truly mobile-first approach actually looks like.",
      published: true,
      publishedAt: new Date('2024-12-03'),
      updatedAt: new Date(),
      author: 'Peter Lehocky',
      body: `<h2>The Numbers Don't Lie</h2>
<p>Across most industries, mobile now accounts for between 55% and 70% of web traffic. In some sectors — hospitality, food, local services — it's even higher. Your customers are searching for you on their phones while they're commuting, waiting in a queue, sitting on a sofa. They're not at a desk.</p>
<p>Yet the vast majority of small business websites I review were built desktop-first and then "made responsive" as an afterthought. The result is a site that technically works on mobile but was never really designed for it.</p>

<img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80" alt="Person browsing a website on a mobile phone" />

<h2>Responsive vs. Mobile-First: The Critical Difference</h2>
<p>A <strong>responsive</strong> website adjusts its layout to fit different screen sizes. This is the baseline — the minimum acceptable standard. But it doesn't mean the mobile experience is good. It just means it's not broken.</p>
<p>A <strong>mobile-first</strong> website is designed starting from the smallest screen. The thinking is different. On mobile, you have limited space, a touch interface, potentially a slow connection, and a user who's probably distracted. Every decision — what to show, in what order, how large to make the tap targets — needs to be made with that person in mind first.</p>
<p>In CSS, mobile-first means writing base styles for small screens and using <code>min-width</code> media queries to enhance for larger ones:</p>

<pre><code class="language-css">/* ❌ Desktop-first: writes for big screens, shrinks down */
.card {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

@media (max-width: 768px) {
  .card {
    flex-direction: column;
    gap: 1rem;
  }
}

/* ✅ Mobile-first: writes for small screens, scales up */
.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .card {
    flex-direction: row;
    gap: 2rem;
  }
}</code></pre>

<h2>The Most Common Mobile Mistakes</h2>
<p><strong>Tiny tap targets</strong> — Buttons and links that are designed for a mouse cursor are too small for a finger. Google recommends tap targets of at least 44×44 pixels with adequate spacing between them. Here's a quick check you can add to your CSS during development:</p>

<pre><code class="language-css">/* Debug helper: highlight elements with insufficient tap target size */
a, button, [role="button"] {
  outline: 2px solid red; /* temporarily enable to audit tap areas */
}

/* Minimum tap target — apply to interactive elements */
.btn, a.nav-link {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
}</code></pre>

<p><strong>Forms that trigger the wrong keyboard</strong> — Every input should have the correct <code>type</code> attribute so mobile browsers show the right keyboard:</p>

<pre><code class="language-html">&lt;!-- Phone number: shows numeric keypad --&gt;
&lt;input type="tel" name="phone" autocomplete="tel" /&gt;

&lt;!-- Email: shows @ and .com keys --&gt;
&lt;input type="email" name="email" autocomplete="email" /&gt;

&lt;!-- Numbers only (e.g. quantity): numeric keypad --&gt;
&lt;input type="number" inputmode="numeric" pattern="[0-9]*" /&gt;

&lt;!-- URL: shows .com button --&gt;
&lt;input type="url" name="website" autocomplete="url" /&gt;</code></pre>

<img src="https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1200&q=80" alt="Mobile UI design wireframes and prototypes" />

<h2>What Mobile-First Design Actually Looks Like</h2>
<p>It starts in the wireframing stage. Before any visual design, I sketch out the mobile layout: what's above the fold, what the user sees first, how they navigate. Then the desktop layout is built as an enhancement — more content visible at once, larger typography, richer visual treatments.</p>
<p>Performance and mobile are deeply linked. A mobile user on a 4G connection in a building with poor signal will have a very different experience than your office broadband connection. This is why image optimisation, lazy loading, and minimal JavaScript are not just performance concerns — they're mobile user experience concerns.</p>

<h2>Test On A Real Device, Not Just Your Browser</h2>
<p>Chrome's mobile emulation mode is useful for quick checks, but it doesn't replicate the real experience. Pull out your phone. Use your site the way a real customer would. Try to book an appointment, find your opening hours, fill in a contact form. Notice what's frustrating.</p>
<p>The results are often humbling — even for developers who thought they'd done a thorough job.</p>

<h2>The Bottom Line</h2>
<p>Your mobile experience is your primary experience. Not a secondary one that gets polished if there's time. The one that most of your potential customers will encounter first and judge you by. Building mobile-first requires more thought upfront, but it results in a better experience on every device.</p>`,

      titleSk: 'Mobile-first nie je voliteľné: Čo väčšina webov robí so small screens zle',
      slugSk: 'mobile-first-chyby-webov',
      excerptSk:
        'Viac ako 60 % návštevnosti vášho webu pochádza z mobilu. Napriek tomu väčšina webov malých podnikov je navrhnutá pre desktop a na telefón len "prispôsobená" — a rozdiel je vidieť. Tu je to, ako skutočný mobile-first prístup vyzerá.',
      bodySk: `<h2>Čísla neklamú</h2>
<p>Vo väčšine odvetví teraz mobilné zariadenia tvoria 55–70 % webovej návštevnosti. V niektorých sektoroch — pohostinstvo, stravovanie, miestne služby — je to ešte viac. Vaši zákazníci vás hľadajú na telefónoch počas cestovania, čakania v rade, sedenia na gauči. Nie sú pri počítači.</p>
<p>Napriek tomu väčšina webov malých podnikov, ktoré kontrolujem, bola postavená desktop-first a potom "urobená responzívnou" ako dodatočná myšlienka. Výsledkom je web, ktorý technicky funguje na mobile, ale nikdy nebol skutočne navrhnutý preňho.</p>

<img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80" alt="Osoba prehliadajúca web na mobile" />

<h2>Responzívny vs. Mobile-first: Kľúčový rozdiel</h2>
<p><strong>Responzívny</strong> web prispôsobuje rozloženie rôznym veľkostiam obrazovky. To je základ — minimálny prijateľný štandard. Ale neznamená to, že mobilný zážitok je dobrý. Len znamená, že nie je rozbitý.</p>
<p><strong>Mobile-first</strong> web je navrhnutý začínajúc od najmenšej obrazovky. Na mobile máte obmedzený priestor, dotykové rozhranie, potenciálne pomalé pripojenie a používateľa, ktorý je pravdepodobne rozptýlený. V CSS to znamená písať základné štýly pre malé obrazovky a pomocou <code>min-width</code> media queries ich rozšíriť pre väčšie:</p>

<pre><code class="language-css">/* ❌ Desktop-first: píše pre veľké obrazovky, zmenšuje */
.karta {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

@media (max-width: 768px) {
  .karta {
    flex-direction: column;
    gap: 1rem;
  }
}

/* ✅ Mobile-first: píše pre malé obrazovky, rozširuje */
.karta {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .karta {
    flex-direction: row;
    gap: 2rem;
  }
}</code></pre>

<h2>Najčastejšie mobilné chyby</h2>
<p><strong>Príliš malé plochy na klepnutie</strong> — Tlačidlá a odkazy navrhnuté pre kurzor myši sú príliš malé pre prst. Google odporúča plochy aspoň 44×44 pixelov. Formulárové vstupy by mali aktivovať správnu klávesnicu:</p>

<pre><code class="language-html">&lt;!-- Telefónne číslo: zobrazí číselnú klávesnicu --&gt;
&lt;input type="tel" name="telefon" autocomplete="tel" /&gt;

&lt;!-- Email: zobrazí @ a .com klávesy --&gt;
&lt;input type="email" name="email" autocomplete="email" /&gt;

&lt;!-- Len čísla: číselná klávesnica --&gt;
&lt;input type="number" inputmode="numeric" pattern="[0-9]*" /&gt;</code></pre>

<img src="https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1200&q=80" alt="Wireframy a prototypy mobilného UI dizajnu" />

<h2>Ako skutočný mobile-first dizajn vyzerá</h2>
<p>Začína sa vo fáze drôtových modelov. Pred akýmkoľvek vizuálnym dizajnom skicujem mobilné rozloženie: čo je nad záhybom, čo používateľ vidí ako prvé, ako naviguje. Potom sa desktopové rozloženie buduje ako vylepšenie.</p>
<p>Výkon a mobil sú úzko prepojené. Mobilný používateľ na 4G pripojení v budove so slabým signálom bude mať úplne iný zážitok ako vaše kancelárske broadband pripojenie. Preto optimalizácia obrázkov, lazy loading a minimálny JavaScript nie sú len výkonnostné starosti — sú to starosti o mobilný používateľský zážitok.</p>

<h2>Záver</h2>
<p>Váš mobilný zážitok je váš primárny zážitok. Nie sekundárny, ktorý sa vyleští, keď bude čas. Ten, s ktorým sa väčšina vašich potenciálnych zákazníkov stretne ako prvý a podľa ktorého vás bude hodnotiť. Budovanie mobile-first vyžaduje viac premýšľania vopred, ale vedie k lepšiemu zážitku na každom zariadení.</p>`,
    },
    {
      title: 'The 5 Things Your Website Is Probably Missing (That No One Told You About)',
      slug: 'website-missing-essentials',
      coverImage: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&q=80',
      excerpt:
        'Beyond a nice design and clear copy, there are five technical and structural elements that most small business websites are missing — and all of them are quietly costing you visibility, trust, and conversions.',
      published: true,
      publishedAt: new Date('2025-01-21'),
      updatedAt: new Date(),
      author: 'Peter Lehocky',
      body: `<h2>When "Good Enough" Isn't</h2>
<p>You've got a website. It looks clean, has your services listed, maybe even a contact form. You're done, right?</p>
<p>Not quite. Most websites — including many built by professional agencies — are missing foundational elements that silently limit their effectiveness. These aren't flashy features. They're infrastructure. And getting them right is what separates a website that works from one that just exists.</p>

<h2>1. Structured Data (Schema Markup)</h2>
<p>Schema markup is a way of telling search engines — in structured, machine-readable format — exactly what your business is, where it is, what it does, and how to contact it. Without it, Google has to guess. With it, you get rich results in search: star ratings, business hours, FAQs, event dates.</p>
<p>Here's what a LocalBusiness schema looks like in practice. You add this as a <code>&lt;script type="application/ld+json"&gt;</code> tag in your <code>&lt;head&gt;</code>:</p>

<pre><code class="language-json">{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Your Business Name",
  "description": "What your business does in one sentence.",
  "url": "https://yourdomain.com",
  "telephone": "+421 900 000 000",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Hlavná 1",
    "addressLocality": "Bratislava",
    "postalCode": "811 01",
    "addressCountry": "SK"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "sameAs": [
    "https://www.linkedin.com/company/your-company",
    "https://www.instagram.com/yourcompany"
  ]
}</code></pre>

<img src="https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&q=80" alt="SEO and structured data for search engine optimisation" />

<h2>2. A Proper Meta Description Strategy</h2>
<p>The meta description is the two lines of text that appear under your page title in Google search results. A good meta description is 130–155 characters, includes a clear value proposition, and is unique to each page:</p>

<pre><code class="language-html">&lt;!-- ❌ Default / generic — same on every page, no value proposition --&gt;
&lt;meta name="description" content="Welcome to Our Website." /&gt;

&lt;!-- ✅ Unique, specific, with a hook --&gt;
&lt;meta
  name="description"
  content="Web design for Slovak businesses that need results, not just a presence. Fast, modern sites built with Next.js. Get a free quote in 24 hours."
/&gt;</code></pre>

<h2>3. HTTPS Everywhere</h2>
<p>Your website should be accessible <em>only</em> via HTTPS. If you're using Nginx, here's how to force redirect all HTTP traffic to HTTPS:</p>

<pre><code class="language-nginx">server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect all HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # HSTS: tell browsers to always use HTTPS for this domain
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # ... rest of your server block
}</code></pre>

<h2>4. An XML Sitemap (And Telling Google About It)</h2>
<p>An XML sitemap is a file that lists all the important URLs on your website. In Next.js App Router, you can generate one dynamically using a <code>sitemap.ts</code> file:</p>

<pre><code class="language-typescript">// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yourdomain.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: \`\${baseUrl}/blog\`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Add dynamic blog posts:
    // ...posts.map((post) => ({ url: \`\${baseUrl}/blog/\${post.slug}\`, ... }))
  ];
}</code></pre>

<img src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80" alt="Web analytics and search console data" />

<h2>5. An Open Graph Image</h2>
<p>When someone shares your website on LinkedIn, Twitter, or WhatsApp, what do they see? In Next.js, you can set Open Graph images per page — and even generate them dynamically with <code>ImageResponse</code>:</p>

<pre><code class="language-typescript">// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      &lt;div style={{ background: '#1a1a2e', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80 }}&gt;
        &lt;div style={{ color: '#f7f4ee', fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}&gt;
          Your Brand Name
        &lt;/div&gt;
        &lt;div style={{ color: 'rgba(247,244,238,0.6)', fontSize: 28, marginTop: 24 }}&gt;
          Web design for businesses that want results.
        &lt;/div&gt;
      &lt;/div&gt;
    ),
    { ...size }
  );
}</code></pre>

<h2>Infrastructure First, Then Design</h2>
<p>The lesson here is that a website is more than what's visible on screen. The technical layer underneath — how it communicates with search engines, how it handles security, how it presents itself across different surfaces — matters enormously for your online performance.</p>
<p>When I build a website, all five of these items are in the initial scope. Not as optional extras. Not as future improvements. As part of what "done" means. Because a beautiful site that nobody can find, that looks broken when shared on social media, or that warns users it's "Not Secure" — isn't really done at all.</p>`,

      titleSk: '5 vecí, ktoré váš web pravdepodobne nemá (a nikto vám to nepovedal)',
      slugSk: 'co-chyba-vasmu-webu',
      excerptSk:
        'Okrem pekného dizajnu a jasného textu existuje päť technických a štrukturálnych prvkov, ktoré väčšina webov malých podnikov postrádá — a všetky tiché stoja viditeľnosť, dôveru a konverzie.',
      bodySk: `<h2>Keď "dosť dobré" nestačí</h2>
<p>Máte web. Vyzerá čisto, máte tam zoznam služieb, možno aj kontaktný formulár. Hotovo, nie?</p>
<p>Nie celkom. Väčšina webov — vrátane mnohých postavených profesionálnymi agentúrami — chýba základné prvky, ktoré ticho obmedzujú ich efektivitu. Nie sú to bombastické funkcie. Je to infraštruktúra. A správne ich nastaviť je to, čo odlišuje web, ktorý funguje, od toho, ktorý len existuje.</p>

<h2>1. Štruktúrované dáta (Schema Markup)</h2>
<p>Schema markup je spôsob, ako povedať vyhľadávačom — v štruktúrovanom, strojovo čitateľnom formáte — čo presne váš biznis je, kde sa nachádza, čo robí a ako ho kontaktovať. Bez toho musí Google hádať. S tým získate bohaté výsledky vo vyhľadávaní. Tu je príklad LocalBusiness schemy:</p>

<pre><code class="language-json">{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Názov vášho biznisu",
  "description": "Čo váš biznis robí v jednej vete.",
  "url": "https://vasadomena.sk",
  "telephone": "+421 900 000 000",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Hlavná 1",
    "addressLocality": "Bratislava",
    "postalCode": "811 01",
    "addressCountry": "SK"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ]
}</code></pre>

<img src="https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&q=80" alt="SEO a štruktúrované dáta pre optimalizáciu pre vyhľadávače" />

<h2>2. Stratégia meta popisov</h2>
<p>Meta popis sú dva riadky textu, ktoré sa zobrazia pod názvom vašej stránky vo výsledkoch Googlu. Dobrý meta popis má 130–155 znakov, obsahuje jasnú hodnotovú ponuku a je jedinečný pre každú stránku:</p>

<pre><code class="language-html">&lt;!-- ❌ Generický — rovnaký na každej stránke, bez hodnotovej ponuky --&gt;
&lt;meta name="description" content="Vitajte na našom webe." /&gt;

&lt;!-- ✅ Jedinečný, špecifický, s háčikom --&gt;
&lt;meta
  name="description"
  content="Webdizajn pre slovenské biznisy, ktoré potrebujú výsledky, nie len prítomnosť. Rýchle, moderné weby postavené v Next.js. Bezplatná konzultácia do 24 hodín."
/&gt;</code></pre>

<h2>3. HTTPS všade</h2>
<p>Váš web by mal byť dostupný <em>iba</em> cez HTTPS. Ak používate Nginx, takto prinútiť presmerovanie všetkej HTTP návštevnosti na HTTPS:</p>

<pre><code class="language-nginx">server {
    listen 80;
    server_name vasadomena.sk www.vasadomena.sk;

    # Presmerovanie všetkej HTTP na HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name vasadomena.sk www.vasadomena.sk;

    ssl_certificate     /etc/letsencrypt/live/vasadomena.sk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vasadomena.sk/privkey.pem;

    # HSTS: povedzte prehliadačom, aby vždy používali HTTPS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}</code></pre>

<h2>4. XML sitemap (a oznámiť to Googlu)</h2>
<p>XML sitemap je súbor, ktorý zoznamuje všetky dôležité URL na vašom webe. V Next.js App Router ho môžete generovať dynamicky pomocou súboru <code>sitemap.ts</code>:</p>

<pre><code class="language-typescript">// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vasadomena.sk';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: \`\${baseUrl}/blog\`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}</code></pre>

<img src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80" alt="Webová analytika a dáta z Search Console" />

<h2>5. Open Graph obrázok</h2>
<p>Keď niekto zdieľa váš web na LinkedIn, Twitteri alebo WhatsApp, čo uvidí? V Next.js môžete nastaviť Open Graph obrázky pre každú stránku — a dokonca ich generovať dynamicky s <code>ImageResponse</code>:</p>

<pre><code class="language-typescript">// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };

export default function Image() {
  return new ImageResponse(
    (
      &lt;div style={{ background: '#1a1a2e', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80 }}&gt;
        &lt;div style={{ color: '#f7f4ee', fontSize: 64, fontWeight: 700 }}&gt;
          Názov vašej značky
        &lt;/div&gt;
        &lt;div style={{ color: 'rgba(247,244,238,0.6)', fontSize: 28, marginTop: 24 }}&gt;
          Webdizajn pre biznisy, ktoré chcú výsledky.
        &lt;/div&gt;
      &lt;/div&gt;
    ),
    { ...size }
  );
}</code></pre>

<h2>Infraštruktúra na prvom mieste, potom dizajn</h2>
<p>Lekcia je tu, že web je viac ako to, čo je viditeľné na obrazovke. Technická vrstva pod tým — ako komunikuje s vyhľadávačmi, ako zvláda bezpečnosť, ako sa prezentuje naprieč rôznymi povrchmi — má obrovský vplyv na váš online výkon.</p>
<p>Keď staviam web, všetkých päť týchto položiek je v počiatočnom rozsahu. Nie ako voliteľné doplnky. Nie ako budúce vylepšenia. Ako súčasť toho, čo znamená "hotovo". Pretože krásny web, ktorý nikto nenájde, ktorý vyzerá rozbitý pri zdieľaní na sociálnych médiách, alebo ktorý varuje používateľov, že je "Nezabezpečený" — v skutočnosti hotový nie je.</p>`,
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
