'use client';

import { ScrollReveal } from '@/components/ui/ScrollReveal/ScrollReveal';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'none';
}

export const FadeIn = ({ children, delay = 0, className, direction = 'up' }: FadeInProps) => (
  <ScrollReveal delay={delay} direction={direction} className={className}>
    {children}
  </ScrollReveal>
);
