'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import './HeroWordCycler.less';

const WORDS_EN = [
  'MARVELOUS',
  'CONVERTING',
  'BEAUTIFUL',
  'PROFITABLE',
  'INNOVATIVE',
  'STUNNING',
  'FUNCTIONAL',
];
const WORDS_SK = ['ÚŽASNÉ', 'VÝKONNÉ', 'KRÁSNE', 'ZISKOVÉ', 'INOVATÍVNE', 'FUNKČNÉ'];

interface HeroWordCyclerProps {
  locale: string;
}

export const HeroWordCycler = ({ locale }: HeroWordCyclerProps) => {
  const words = locale === 'sk' ? WORDS_SK : WORDS_EN;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className="hero-word-cycler">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          className="hero__title-accent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
