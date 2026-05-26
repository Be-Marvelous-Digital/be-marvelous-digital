import { getTranslations } from 'next-intl/server';
import { TechStackMarquee } from './TechStackMarquee';
import './TechStack.less';

interface Skill {
  image: string;
  headline: string;
  description: string;
}

export const TechStack = async () => {
  const t = await getTranslations('stack');

  const skills: Skill[] = [
    { image: '/skills/1.png', headline: 'React', description: t('skills.react') },
    { image: '/skills/2.png', headline: 'Redux', description: t('skills.redux') },
    { image: '/skills/3.png', headline: 'JavaScript', description: t('skills.js') },
    { image: '/skills/4.png', headline: 'CSS / LESS', description: t('skills.css') },
    { image: '/skills/5.png', headline: 'Tailwind', description: t('skills.tailwind') },
    { image: '/skills/6.png', headline: 'HTML', description: t('skills.html') },
    { image: '/skills/7.png', headline: 'Git', description: t('skills.git') },
    { image: '/skills/8.png', headline: 'TypeScript', description: t('skills.ts') },
    { image: '/skills/9.png', headline: 'GraphQL', description: t('skills.graphql') },
    { image: '/skills/10.png', headline: 'Docker', description: t('skills.docker') },
    { image: '/skills/11.png', headline: 'Node.js', description: t('skills.node') },
    { image: '/skills/12.png', headline: 'Figma', description: t('skills.figma') },
  ];

  return (
    <section
      className="techstack section--dark"
      id="stack"
      aria-labelledby="techstack-heading"
      data-nav-dark
    >
      <div className="container techstack__header-wrap">
        <span className="label-text techstack__label">{t('label')}</span>
        <h2 className="techstack__title" id="techstack-heading">
          {t('titlePlain')} <span className="techstack__title-outline">{t('titleAccent')}</span>{' '}
          {t('titleSuffix')}
        </h2>
      </div>
      <TechStackMarquee skills={skills} />
    </section>
  );
};
