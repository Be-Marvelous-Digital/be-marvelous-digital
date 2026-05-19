'use client';

import { usePathname } from 'next/navigation';
import type { PortfolioCardItem } from '@/components/ui/testimonials-columns-1';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';

interface PortfolioColumnsClientProps {
  col1: PortfolioCardItem[];
  col2: PortfolioCardItem[];
  col3: PortfolioCardItem[];
  projectIds: string[];
}

export const PortfolioColumnsClient = ({
  col1,
  col2,
  col3,
  projectIds,
}: PortfolioColumnsClientProps) => {
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'sk';
  const prefix = locale === 'en' ? '/en' : '';

  const allItems = [...col1, ...col2, ...col3];
  const allIds = projectIds;

  return (
    <div className="portfolio__columns-wrapper">
      {/* Mobile: single column with all projects */}
      <TestimonialsColumn
        testimonials={allItems}
        className="block md:hidden"
        duration={24}
        itemHrefPrefix={`${prefix}/portfolio/`}
        itemIds={allIds}
      />
      {/* Desktop: split into 3 columns */}
      <TestimonialsColumn
        testimonials={col1}
        className="hidden md:block"
        duration={18}
        itemHrefPrefix={`${prefix}/portfolio/`}
        itemIds={projectIds.slice(0, 2)}
      />
      <TestimonialsColumn
        testimonials={col2}
        className="hidden md:block"
        duration={22}
        itemHrefPrefix={`${prefix}/portfolio/`}
        itemIds={projectIds.slice(2, 4)}
      />
      <TestimonialsColumn
        testimonials={col3}
        className="hidden lg:block"
        duration={20}
        itemHrefPrefix={`${prefix}/portfolio/`}
        itemIds={projectIds.slice(4, 6)}
      />
    </div>
  );
};
