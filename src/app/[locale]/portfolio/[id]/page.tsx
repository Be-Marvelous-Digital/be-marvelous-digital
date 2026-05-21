import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/ui/FadeIn/FadeIn';
import { Navigation } from '@/components/Navigation/Navigation';
import { Footer } from '@/components/Footer/Footer';
import { ProjectHero } from '@/components/ProjectHero/ProjectHero';
import { portfolioProjects } from '@/data/portfolio';
import './page.less';

interface ProjectPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  const locales = ['sk', 'en'];
  return locales.flatMap((locale) =>
    portfolioProjects.map((project) => ({ locale, id: project.id })),
  );
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const project = portfolioProjects.find((p) => p.id === id);
  if (!project) return {};

  const metaDescription =
    locale === 'sk' && project.descriptionSk ? project.descriptionSk : project.description;

  const isSk = locale === 'sk';
  const metaTitle = `${project.name} — ${isSk ? 'Prípadová štúdia' : 'Case Study'} | Be Marvelous Digital`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: isSk ? `/portfolio/${id}` : `/en/portfolio/${id}`,
      languages: {
        sk: `/portfolio/${id}`,
        en: `/en/portfolio/${id}`,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      images: [{ url: project.screenshot, width: 1400, height: 720 }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations('portfolio_page');
  const project = portfolioProjects.find((p) => p.id === id);

  if (!project) notFound();

  const isSk = locale === 'sk';
  const displayDescription =
    isSk && project.descriptionSk ? project.descriptionSk : project.description;
  const displayProblem = isSk && project.problemSk ? project.problemSk : project.problem;
  const displaySolution = isSk && project.solutionSk ? project.solutionSk : project.solution;
  const displayResults = isSk && project.resultsSk ? project.resultsSk : project.results;

  const currentIndex = portfolioProjects.findIndex((p) => p.id === id);
  const nextProject = portfolioProjects[(currentIndex + 1) % portfolioProjects.length];
  const portfolioHref = isSk ? '/#portfolio' : '/en/#portfolio';
  const nextHref = isSk ? `/portfolio/${nextProject.id}` : `/en/portfolio/${nextProject.id}`;

  return (
    <>
      <Navigation />
      <main>
        <ProjectHero
          portfolioHref={portfolioHref}
          backLabel={t('back')}
          category={project.category}
          name={project.name}
          description={displayDescription}
          pageImage={project.pageImage}
          url={project.url}
        />

        <div className="project__body">
          <FadeIn delay={0}>
            <div className="project__section">
              <p className="project__section-label">{t('problem')}</p>
              <h2 className="project__section-title">{t('problem')}</h2>
              <p className="project__section-text">{displayProblem}</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="project__section">
              <p className="project__section-label">{t('solution')}</p>
              <h2 className="project__section-title">{t('solution')}</h2>
              <p className="project__section-text">{displaySolution}</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.24}>
            <div className="project__section">
              <p className="project__section-label">{t('results')}</p>
              <h2 className="project__section-title">{t('results')}</h2>
              <ul className="project__results" aria-label="Project results">
                {displayResults.map((result) => (
                  <li key={result} className="project__result">
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        <FadeIn>
          <div className="project__actions">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary btn--lg"
            >
              {t('visitSite')}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <Link href={nextHref} className="btn btn--secondary btn--lg">
              {t('nextProject')} — {nextProject.name}
            </Link>
          </div>
        </FadeIn>
      </main>
      <Footer />
    </>
  );
}
