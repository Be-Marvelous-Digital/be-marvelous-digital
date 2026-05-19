"use client";
import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import './testimonials-columns-1.less';

export interface PortfolioCardItem {
  text: string;
  image: string;
  name: string;
  role: string;
  url?: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: PortfolioCardItem[];
  duration?: number;
  itemHrefPrefix?: string;
  itemIds?: string[];
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration ?? 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-4 pb-4"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => {
              const href =
                props.itemHrefPrefix && props.itemIds
                  ? `${props.itemHrefPrefix}${props.itemIds[i]}`
                  : undefined;

              const cardContent = (
                <div className="portfolio-card rounded-2xl border max-w-xs w-full overflow-hidden">
                  <div className="portfolio-card__thumb">
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="portfolio-card__body">
                    <span className="portfolio-card__role">{role}</span>
                    <span className="portfolio-card__name">{name}</span>
                    <p className="portfolio-card__text">{text}</p>
                  </div>
                </div>
              );

              return href ? (
                <Link key={i} href={href} className="block no-underline">
                  {cardContent}
                </Link>
              ) : (
                <div key={i}>{cardContent}</div>
              );
            })}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
