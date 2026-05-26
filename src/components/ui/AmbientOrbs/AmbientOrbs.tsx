import './AmbientOrbs.less';

/**
 * Three position:fixed ambient glow orbs that float across the entire page.
 * Uses mix-blend-mode:screen so they add colour on dark backgrounds without
 * obscuring any text or UI. pointer-events:none keeps them fully inert.
 */
export const AmbientOrbs = () => (
  <div className="ambient-orbs" aria-hidden="true">
    <div className="ambient-orbs__orb ambient-orbs__orb--1" />
    <div className="ambient-orbs__orb ambient-orbs__orb--2" />
    <div className="ambient-orbs__orb ambient-orbs__orb--3" />
  </div>
);
