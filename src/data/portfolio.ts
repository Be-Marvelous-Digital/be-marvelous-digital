export interface PortfolioProject {
  id: string;
  name: string;
  domain: string;
  url: string;
  description: string;
  descriptionSk?: string;
  category: string;
  tags: string[];
  accentColor: string;
  screenshot: string;
  pageImage: string;
  problem: string;
  problemSk?: string;
  solution: string;
  solutionSk?: string;
  results: string[];
  resultsSk?: string[];
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'top-farm',
    name: 'Top Farm',
    domain: 'top-farm.ae',
    url: 'https://top-farm.ae',
    description:
      'Portfolio website for a Slovak entrepreneur expanding into the UAE — a professional, investor-ready presence built to open doors in a new market.',
    descriptionSk:
      'Portfóliová webstránka pre slovenského podnikateľa expandujúceho do SAE — profesionálna, na investorov zameraná prezentácia navrhnutá na otvorenie dverí na novom trhu.',
    category: 'Portfolio / Agriculture',
    tags: ['Portfolio', 'Investor Relations', 'UAE', 'Slovak'],
    accentColor: '#2D6A3F',
    screenshot: '/project-icons/project-topfarm.png',
    pageImage: '/project-pages/topfarm.png',
    problem:
      'A Slovak agricultural entrepreneur was expanding into the UAE and needed a professional portfolio website to present his operations and vision to potential investors and business partners. Without a polished English-language web presence tailored to investor expectations, building credibility in an unfamiliar market was an uphill battle.',
    problemSk:
      'Slovenský podnikateľ v poľnohospodárstve expandoval do SAE a potreboval profesionálnu portfóliovú webstránku, cez ktorú by prezentoval svoje aktivity a víziu potenciálnym investorom a obchodným partnerom. Bez prepracovanej anglickej online prezentácie prispôsobenej očakávaniam investorov bolo budovanie dôveryhodnosti na novom trhu náročné.',
    solution:
      'Built an English-language portfolio website with a clear investment narrative — highlighting the scale of operations, certifications, and growth story. The content structure was designed specifically to address the due-diligence checklist of UAE investors, conveying authority and long-term vision at a glance.',
    solutionSk:
      'Vytvorili sme anglickú portfóliovú webstránku s jasným investičným príbehom — zdôrazňujúcou rozsah operácií, certifikácie a rastový príbeh. Obsahová štruktúra bola navrhnutá priamo na nároky due diligence investorov v SAE, aby na prvý pohľad sprostredkovala autoritu a dlhodobú víziu.',
    results: [
      'Investor-ready presence launched ahead of first UAE partnership meetings',
      'Professional English-language site built credibility with international investors',
      'Client secured initial investor conversations within weeks of launch',
    ],
    resultsSk: [
      'Prezentácia pripravená pre investorov spustená pred prvými rokovaniami o partnerstve v SAE',
      'Profesionálna anglická stránka vybudovala dôveryhodnosť u medzinárodných investorov',
      'Klient získal prvé investorské rokovania v priebehu týždňov od spustenia',
    ],
  },
  {
    id: 'repette',
    name: 'Repette',
    domain: 'repette.cz',
    url: 'https://repette.cz',
    description:
      'Website redesign for a Czech non-profit mediating between children and parents during divorce — replacing a confusing, outdated site with something clear, calm, and genuinely helpful.',
    descriptionSk:
      'Redesign webstránky pre českú neziskovú organizáciu sprostredkúvajúcu vzťahy medzi deťmi a rodičmi počas rozvodu — nahradenie mätúcej, zastaranej stránky niečím zrozumiteľným, pokojným a skutočne užitočným.',
    category: 'Non-profit / Social Services',
    tags: ['Non-profit', 'UX Redesign', 'Czech'],
    accentColor: '#B44A2B',
    screenshot: '/project-icons/project-repette.png',
    pageImage: '/project-pages/repette.png',
    problem:
      'Repette helps families navigate one of the most emotionally difficult experiences in life — yet their website was making it harder, not easier. Poor UX, cluttered layout, and unclear information meant that parents and children in distress couldn\'t quickly find the support they were looking for. For an audience already under significant stress, a frustrating website wasn\'t just a design problem; it was a barrier to getting help.',
    problemSk:
      'Repette pomáha rodinám zvládnuť jeden z emocionálne najnáročnejších zážitkov v živote — no ich webstránka to skôr sťažovala. Slabé UX, neusporiadané rozloženie a nejasné informácie spôsobovali, že rodičia a deti v núdzi nedokázali rýchlo nájsť pomoc, ktorú hľadali. Pre publikum vystavené výraznému stresu nebola frustrujúca stránka len dizajnovým problémom — bola to bariéra na ceste k pomoci.',
    solution:
      'Redesigned the website from the ground up with clarity, empathy, and trust as the guiding principles. Restructured the information architecture so visitors immediately understand what Repette does and how to reach them. Simplified navigation, plain-language content, and a calm, reassuring visual tone suited to the emotional weight of their audience\'s situation.',
    solutionSk:
      'Celkovo sme prenavrhli webstránku, pričom vodiacimi princípmi boli zrozumiteľnosť, empatia a dôvera. Preštruktúrovali sme informačnú architektúru tak, aby návštevníci okamžite pochopili, čo Repette robí a ako ich kontaktovať. Zjednodušená navigácia, obsah v zrozumiteľnom jazyku a pokojný, upokojujúci vizuálny tón zodpovedajúci emocionálnej váhe situácie ich cieľovej skupiny.',
    results: [
      'Key services and contact information now reachable within seconds of landing',
      'Families in distress no longer bouncing off a confusing homepage',
      'Organisation reported a clear increase in first-contact inquiries after relaunch',
    ],
    resultsSk: [
      'Kľúčové služby a kontaktné informácie sú teraz dostupné v priebehu sekúnd od príchodu na stránku',
      'Rodiny v núdzi už neopúšťajú mätúcu úvodnú stránku bez pomoci',
      'Organizácia zaznamenala výrazný nárast prvých dopytov po opätovnom spustení',
    ],
  },
  {
    id: 'helgeheim',
    name: 'Helgeheim',
    domain: 'helgeheim.com',
    url: 'https://helgeheim.com',
    description:
      'Corporate website for a pharmaceutical Contract Manufacturing Organisation specialising in high-potent sterile products — a technically credible, trust-first presence built for a demanding B2B audience.',
    descriptionSk:
      'Korporátna webstránka pre farmaceutickú organizáciu zmluvnej výroby špecializujúcu sa na vysoko potentné sterilné produkty — technicky dôveryhodná prezentácia zameraná na náročné B2B publikum.',
    category: 'Pharmaceutical / Corporate',
    tags: ['Pharmaceutical', 'CMO', 'B2B'],
    accentColor: '#4A3728',
    screenshot: '/project-icons/project-helgeheim.png',
    pageImage: '/project-pages/helgeheim.png',
    problem:
      'HelgeHeim needed a corporate website capable of communicating the full scope of their manufacturing capabilities to potential pharmaceutical partners — a highly technical, compliance-driven audience with no tolerance for vague claims. Their offer spans sterile vial filling, non-PVC bag manufacturing, analytical laboratories, and regulatory support, but without a structured web presence, none of that expertise was visible to prospective clients.',
    problemSk:
      'HelgeHeim potreboval korporátnu webstránku, ktorá by dokázala potenciálnym farmaceutickým partnerom sprostredkovať plný rozsah ich výrobných kapacít — vysoko technickému publiku zameranému na súlad s predpismi, ktoré netoleruje vágne tvrdenia. Ich ponuka zahŕňa sterilné plnenie liekoviek, výrobu non-PVC vakov, analytické laboratóriá a regulačnú podporu, no bez štruktúrovanej online prezentácie nebola žiadna z týchto kompetencií pre potenciálnych klientov viditeľná.',
    solution:
      'Built a structured, authoritative corporate website that leads with capability and compliance — clearly presenting their manufacturing services for vials (batch sizes 50–5,000 L, 36M units annual throughput) and non-PVC bags (up to 10,000 L batches, 25M litres annually), facility specifications, and regulatory adherence to EU EudraLex Vol. 4 and GMP standards. The content architecture gives procurement and partnership teams everything they need to move to due diligence with confidence.',
    solutionSk:
      'Vytvorili sme štruktúrovanú, autoritatívnu korporátnu webstránku, ktorá v popredí stavia kapacity a súlad s predpismi — prehľadne prezentujúcu výrobné služby pre liekovky (veľkosti šarží 50–5 000 l, ročný objem 36 mil. kusov) a non-PVC vaky (šarže až 10 000 l, 25 mil. litrov ročne), špecifikácie zariadení a dodržiavanie EU EudraLex Vol. 4 a GMP štandardov. Architektúra obsahu poskytuje nákupným tímom a tímom pre partnerstvá všetko potrebné na sebavedomé kroky v procese due diligence.',
    results: [
      'Full manufacturing capability — vials, bags, labs, and regulatory services — presented in one structured reference',
      'Compliance credentials (GMP, EU EudraLex Vol. 4, ICH Q1A) clearly surfaced for procurement audiences',
      'Professional web presence aligned with the credibility standards expected in pharmaceutical B2B',
    ],
    resultsSk: [
      'Celé výrobné kapacity — liekovky, vaky, laboratóriá a regulačné služby — prezentované v jednom štruktúrovanom prehľade',
      'Certifikáty súladu (GMP, EU EudraLex Vol. 4, ICH Q1A) prehľadne sprístupnené pre nákupné tímy',
      'Profesionálna online prezentácia zodpovedajúca štandardom dôveryhodnosti očakávaným v B2B farmaceutickom sektore',
    ],
  },
  {
    id: 'eyesopen',
    name: 'Eyes Open',
    domain: 'eyesopen.sk',
    url: 'https://eyesopen.sk',
    description:
      'Portfolio and identity for a creative design studio — a site that confidently showcases bold work without getting in its own way.',
    descriptionSk:
      'Portfólio a identita pre kreatívne dizajnové štúdio — stránka, ktorá sebavedomene prezentuje odvážnu tvorbu bez toho, aby si brala pozornosť.',
    category: 'Design Studio',
    tags: ['Agency', 'Portfolio', 'Creative'],
    accentColor: '#1A1A2E',
    screenshot: '/project-icons/project-eyesopen.png',
    pageImage: '/project-pages/eyesopen.png',
    problem:
      'Eyes Open, a Bratislava-based design studio, had built a reputation through word-of-mouth but lacked a digital portfolio. Their existing website was generic and failed to differentiate them from dozens of similar studios.',
    problemSk:
      'Eyes Open, bratislavské dizajnové štúdio, si vybudovalo reputáciu ústnym podaním, ale chýbalo mu digitálne portfólio. Ich existujúca stránka bola generická a nedokázala ich odlíšiť od desiatok podobných štúdií.',
    solution:
      'Co-created a distinctive portfolio structure with custom page transitions, a project filtration system, and a minimal typographic aesthetic that put their work front and center. Built with a headless CMS so the team could self-manage case studies.',
    solutionSk:
      'Spolutvorili sme výraznú portfóliovú štruktúru s vlastnými prechodmi medzi stránkami, systémom filtrovania projektov a minimalistickou typografickou estetikou, ktorá dáva ich tvorbu do popredia. Postavené na headless CMS, aby tím mohol samostatne spravovať prípadové štúdie.',
    results: [
      'Inbound project inquiries increased 4× within 2 months',
      'Won two regional design awards after the site was featured',
      'Team now self-manages all content without developer involvement',
    ],
    resultsSk: [
      'Prichádzajúce dopyty na projekty vzrástli 4× za 2 mesiace',
      'Získali dve regionálne dizajnové ocenenia po prezentácii stránky',
      'Tím teraz samostatne spravuje všetok obsah bez účasti vývojára',
    ],
  },
  {
    id: 'kidsarena',
    name: 'Kids Arena',
    domain: 'kidsarena.sk',
    url: 'https://kidsarena.sk',
    description:
      "Vibrant website for a children's entertainment venue — energetic design that presents the full offer, from indoor play to jumping castle rentals, with online booking handled through Bookio.",
    descriptionSk:
      'Živá webstránka pre detské zábavné centrum — energická tvorba prezentujúca celú ponuku, od vnútorného hrania až po prenájom skákacích hradov, s online rezerváciami cez Bookio.',
    category: 'Entertainment / Leisure',
    tags: ['Entertainment', 'Family', 'Slovakia'],
    accentColor: '#D4480A',
    screenshot: '/project-icons/project-kidsarena.png',
    pageImage: '/project-pages/kidsarena.png',
    problem:
      "Kids Arena had no web presence to showcase their full offer — not just the indoor play centre, but also jumping castle and attraction rentals available for birthday parties, school events, city events, and other occasions. Without an online booking option, parents had no way to check availability or reserve without calling during business hours. The client also had a limited budget, ruling out a custom-built reservation system.",
    problemSk:
      'Kids Arena nemala žiadnu webovú prezentáciu, ktorá by predstavila celú ich ponuku — nielen vnútorné detské ihrisko, ale aj prenájom skákacích hradov a atrakcií na narodeninovné párty, školské podujatia, mestské akcie a iné príležitosti. Bez online rezervácie rodičia nemali možnosť overiť dostupnosť ani rezervovať bez telefonovania počas pracovných hodín. Klient mal navyše obmedzený rozpočet, čo vylučovalo vývoj vlastného rezervačného systému.',
    solution:
      'Built a high-energy, family-friendly website that clearly presents the full range of services — indoor play, jumping castle rentals, and attraction hire for events of all sizes. For bookings, we integrated Bookio, a third-party reservation platform, keeping development costs low while still giving parents a smooth online booking experience.',
    solutionSk:
      'Vytvorili sme energickú, rodinne orientovanú webstránku, ktorá prehľadne predstavuje celú škálu služieb — vnútorné ihrisko, prenájom skákacích hradov a atrakcií na podujatia rôznych veľkostí. Pre rezervácie sme integrovali Bookio, platformu tretej strany, čím sme udržali nízke náklady na vývoj a zároveň poskytli rodičom plynulý zážitok z online rezervácie.',
    results: [
      'Full service offer — play centre and event rentals — clearly communicated in one place',
      'Online booking enabled via Bookio without the cost of a custom-built system',
      'Parents can check availability and reserve attractions for any event type without calling',
    ],
    resultsSk: [
      'Celá ponuka služieb — ihrisko aj prenájom na podujatia — prehľadne prezentovaná na jednom mieste',
      'Online rezervácia umožnená cez Bookio bez nákladov na vlastný systém',
      'Rodičia môžu overiť dostupnosť a rezervovať atrakcie na akýkoľvek typ podujatia bez telefonovania',
    ],
  },
  {
    id: 'pizzapohoda',
    name: 'Pizza Pohoda',
    domain: 'pizzapohoda.sk',
    url: 'https://pizzapohoda.sk',
    description:
      'Restaurant ordering platform targeting the younger crowd — a comfortable web form, a live admin dashboard, and a kitchen-connected printer that keeps operations running smoothly.',
    descriptionSk:
      'Objednávkový systém pre reštauráciu zameraný na mladšiu generáciu — pohodlný webový formulár, živý administrátorský panel a kuchynská tlačiareň, ktorá udržuje prevádzku v chode.',
    category: 'Food & Restaurant',
    tags: ['Restaurant', 'Ordering System', 'Admin Dashboard'],
    accentColor: '#8B1A1A',
    screenshot: '/project-icons/project-pizza-pohoda.png',
    pageImage: '/project-pages/pohoda.png',
    problem:
      'Pizza Pohoda was missing out on younger customers who found phone ordering uncomfortable — this generation prefers typing to calling, and the friction of a phone call was enough to send them elsewhere. On top of that, every incoming order call interrupted the hostess during service, creating a bottleneck in the kitchen workflow.',
    problemSk:
      'Pizza Pohoda prichádzala o mladších zákazníkov, ktorí telefonické objednávanie považovali za nepohodlné — táto generácia uprednostňuje písanie pred volaním a samotná bariéra telefonátu im stačila na to, aby šli inam. K tomu každý prichádzajúci hovor s objednávkou prerušoval čašníčku počas obsluhy, čo vytváralo úzke miesto v kuchynskom procese.',
    solution:
      'Built a web-based ordering form designed for comfortable desktop use — familiar UX for younger customers who prefer typing to calling. An admin dashboard lets staff track live orders and create manual entries. The system connects directly to a kitchen printer: every confirmed order prints automatically, so the hostess no longer has to relay orders by hand, freeing her to focus entirely on the floor.',
    solutionSk:
      'Vytvorili sme webový objednávkový formulár navrhnutý pre pohodlné používanie na počítači — zrozumiteľné UX pre mladšiu generáciu, ktorá uprednostňuje písanie pred volaním. Administrátorský panel umožňuje personálu sledovať živé objednávky a vytvárať manuálne záznamy. Systém je priamo prepojený s kuchynskou tlačiarňou: každá potvrdená objednávka sa automaticky vytlačí, takže čašníčka už objednávky nemusí odovzdávať ručne a môže sa plne venovať obsluhe.',
    results: [
      'Younger customers began ordering online instead of avoiding the phone call',
      'Kitchen received printed order tickets automatically, eliminating relay errors',
      'Hostess freed from phone duty during peak hours, improving floor service quality',
    ],
    resultsSk: [
      'Mladší zákazníci začali objednávať online namiesto vyhýbania sa telefonátu',
      'Kuchyňa dostáva vytlačené lístky automaticky, čím sa eliminovali chyby pri odovzdávaní objednávok',
      'Čašníčka uvoľnená od telefónu počas špičky, čo zlepšilo kvalitu obsluhy v reštaurácii',
    ],
  },
];
