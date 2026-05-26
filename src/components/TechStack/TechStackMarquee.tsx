'use client';

interface Skill {
  image: string;
  headline: string;
  description: string;
}

interface TechStackMarqueeProps {
  skills: Skill[];
}

const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => (
  <div className="techstack__card" key={index}>
    <div className="techstack__card-icon">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={skill.image} alt={`${skill.headline} logo`} width={28} height={28} />
    </div>
    <div className="techstack__card-body">
      <span className="techstack__card-name">{skill.headline}</span>
      <p className="techstack__card-desc">{skill.description}</p>
    </div>
  </div>
);

export const TechStackMarquee = ({ skills }: TechStackMarqueeProps) => {
  const row1 = skills.slice(0, 6);
  const row2 = skills.slice(6, 12);

  return (
    <div className="techstack__rows" aria-hidden="true">
      {/* Row 1 → scrolls left */}
      <div className="techstack__row techstack__row--left">
        <div className="techstack__row-inner">
          {[...row1, ...row1].map((skill, i) => (
            <SkillCard key={`r1-${i}`} skill={skill} index={i} />
          ))}
        </div>
      </div>

      {/* Row 2 → scrolls right */}
      <div className="techstack__row techstack__row--right">
        <div className="techstack__row-inner">
          {[...row2, ...row2].map((skill, i) => (
            <SkillCard key={`r2-${i}`} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
