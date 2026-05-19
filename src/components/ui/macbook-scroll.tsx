'use client';
import React, { useCallback, useRef, useState } from 'react';
import { MotionValue, motion, useScroll, useTransform } from 'motion/react';
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronUp,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconSearch,
  IconWorld,
  IconCommand,
  IconCaretLeftFilled,
  IconCaretDownFilled,
} from '@tabler/icons-react';
import './macbook-scroll.less';

interface MacbookScrollProps {
  src?: string;
  showGradient?: boolean;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
  url?: string;
  scrollYProgress?: MotionValue<number>;
}

export const MacbookScroll = ({
  src,
  showGradient,
  title,
  badge,
  url,
  scrollYProgress: externalScrollYProgress,
}: MacbookScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: internalScrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const scrollYProgress = externalScrollYProgress ?? internalScrollYProgress;

  const [isMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const scaleX = useTransform(scrollYProgress, [0, 0.3], [1.2, isMobile ? 1 : 1.5]);
  const scaleY = useTransform(scrollYProgress, [0, 0.3], [0.6, isMobile ? 1 : 1.5]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
  const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const macbookContent = (
    <>
      <motion.div
        style={{ translateY: textTransform, opacity: textOpacity }}
        className="macbook__title"
      >
        {title}
      </motion.div>

      <Lid
        src={src}
        url={url}
        scaleX={scaleX}
        scaleY={scaleY}
        rotate={rotate}
        translate={translate}
      />

      <div className="macbook__base">
        <div className="macbook__top-bar">
          <div className="macbook__hinge" />
        </div>
        <div className="macbook__keyboard-row">
          <div className="macbook__speaker">
            <SpeakerGrid />
          </div>
          <div className="macbook__keypad-wrapper">
            <Keypad />
          </div>
          <div className="macbook__speaker">
            <SpeakerGrid />
          </div>
        </div>
        <div className="macbook__trackpad" />
        <div className="macbook__cutout" />
        {showGradient && <div className="macbook__gradient" />}
        {badge && <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>{badge}</div>}
      </div>
    </>
  );

  return (
    <div ref={ref} className="macbook">
      {macbookContent}
    </div>
  );
};

interface LidProps {
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  rotate: MotionValue<number>;
  translate: MotionValue<number>;
  src?: string;
  url?: string;
}

export const Lid = ({ scaleX, scaleY, rotate, translate, src, url }: LidProps) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cursorRef.current) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    cursorRef.current.style.left = `${e.clientX - rect.left}px`;
    cursorRef.current.style.top = `${e.clientY - rect.top}px`;
  }, []);

  const handleMouseEnter = useCallback(() => setCursorVisible(true), []);
  const handleMouseLeave = useCallback(() => setCursorVisible(false), []);

  return (
    <div className="macbook__lid-wrapper">
      <div
        className="macbook__lid-back"
        style={{
          transform: 'perspective(800px) rotateX(-25deg) translateZ(0px)',
          transformOrigin: 'bottom',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="macbook__lid-logo">
          <span className="macbook__lid-logo-icon">
            <AceternityLogo />
          </span>
        </div>
      </div>
      <motion.div
        className="macbook__lid-screen"
        style={{
          scaleX,
          scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: 'preserve-3d',
          transformOrigin: 'top',
        }}
      >
        <div className="macbook__lid-screen-bg" />
        {src && url ? (
          <div
            className="macbook__lid-screen-link"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="macbook__link-overlay"
              aria-label="View live website"
            />
            <img src={src} alt="macbook screen" className="macbook__lid-screen-img" />
            <div
              ref={cursorRef}
              className={`macbook__cursor-popover${cursorVisible ? ' macbook__cursor-popover--visible' : ''}`}
            >
              <span className="macbook__cursor-dot" aria-hidden="true" />
              <span className="macbook__cursor-label">View live website</span>
            </div>
          </div>
        ) : src ? (
          <img src={src} alt="macbook screen" className="macbook__lid-screen-img" />
        ) : null}
      </motion.div>
    </div>
  );
};

export const Trackpad = () => {
  return <div className="macbook__trackpad" />;
};

export const Keypad = () => {
  return (
    <div className="macbook__keypad">
      {/* Row 1 — function keys */}
      <div className="macbook__key-row">
        <KBtn wide="w10" align="start">
          esc
        </KBtn>
        <KBtn>
          <IconBrightnessDown className="macbook__key-icon" />
          <span className="macbook__key-label-inline">F1</span>
        </KBtn>
        <KBtn>
          <IconBrightnessUp className="macbook__key-icon" />
          <span className="macbook__key-label-inline">F2</span>
        </KBtn>
        <KBtn>
          <IconTable className="macbook__key-icon" />
          <span className="macbook__key-label-inline">F3</span>
        </KBtn>
        <KBtn>
          <IconSearch className="macbook__key-icon" />
          <span className="macbook__key-label-inline">F4</span>
        </KBtn>
        <KBtn>
          <IconMicrophone className="macbook__key-icon" />
          <span className="macbook__key-label-inline">F5</span>
        </KBtn>
        <KBtn>
          <IconMoon className="macbook__key-icon" />
          <span className="macbook__key-label-inline">F6</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackPrev className="macbook__key-icon" />
          <span className="macbook__key-label-inline">F7</span>
        </KBtn>
        <KBtn>
          <IconPlayerSkipForward className="macbook__key-icon" />
          <span className="macbook__key-label-inline">F8</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackNext className="macbook__key-icon" />
          <span className="macbook__key-label-inline">F9</span>
        </KBtn>
        <KBtn>
          <IconVolume3 className="macbook__key-icon" />
          <span className="macbook__key-label-inline">F10</span>
        </KBtn>
        <KBtn>
          <IconVolume2 className="macbook__key-icon" />
          <span className="macbook__key-label-inline">F11</span>
        </KBtn>
        <KBtn>
          <IconVolume className="macbook__key-icon" />
          <span className="macbook__key-label-inline">F12</span>
        </KBtn>
        <KBtn>
          <div className="macbook__power-outer">
            <div className="macbook__power-inner" />
          </div>
        </KBtn>
      </div>

      {/* Row 2 — numbers */}
      <div className="macbook__key-row">
        <KBtn>
          <span className="macbook__key-label">~</span>
          <span className="macbook__key-label-inline">`</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">!</span>
          <span className="macbook__key-label">1</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">@</span>
          <span className="macbook__key-label">2</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">#</span>
          <span className="macbook__key-label">3</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">$</span>
          <span className="macbook__key-label">4</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">%</span>
          <span className="macbook__key-label">5</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">^</span>
          <span className="macbook__key-label">6</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">&amp;</span>
          <span className="macbook__key-label">7</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">*</span>
          <span className="macbook__key-label">8</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">(</span>
          <span className="macbook__key-label">9</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">)</span>
          <span className="macbook__key-label">0</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">&mdash;</span>
          <span className="macbook__key-label">_</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">+</span>
          <span className="macbook__key-label">=</span>
        </KBtn>
        <KBtn wide="w10" align="end">
          delete
        </KBtn>
      </div>

      {/* Row 3 — QWERTY */}
      <div className="macbook__key-row">
        <KBtn wide="w10" align="start">
          tab
        </KBtn>
        {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((k) => (
          <KBtn key={k}>
            <span className="macbook__key-label">{k}</span>
          </KBtn>
        ))}
        <KBtn>
          <span className="macbook__key-label">{'{'}</span>
          <span className="macbook__key-label">{'['}</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">{'}'}</span>
          <span className="macbook__key-label">{']'}</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">{'|'}</span>
          <span className="macbook__key-label">{'\\'}</span>
        </KBtn>
      </div>

      {/* Row 4 — ASDF */}
      <div className="macbook__key-row">
        <KBtn wide="caps" align="start">
          caps lock
        </KBtn>
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((k) => (
          <KBtn key={k}>
            <span className="macbook__key-label">{k}</span>
          </KBtn>
        ))}
        <KBtn>
          <span className="macbook__key-label">:</span>
          <span className="macbook__key-label">;</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">&quot;</span>
          <span className="macbook__key-label">&apos;</span>
        </KBtn>
        <KBtn wide="return" align="end">
          return
        </KBtn>
      </div>

      {/* Row 5 — ZXCV */}
      <div className="macbook__key-row">
        <KBtn wide="shift" align="start">
          shift
        </KBtn>
        {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((k) => (
          <KBtn key={k}>
            <span className="macbook__key-label">{k}</span>
          </KBtn>
        ))}
        <KBtn>
          <span className="macbook__key-label">{'<'}</span>
          <span className="macbook__key-label">{','}</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">{'>'}</span>
          <span className="macbook__key-label">{'.'}</span>
        </KBtn>
        <KBtn>
          <span className="macbook__key-label">{'?'}</span>
          <span className="macbook__key-label">{'/'}</span>
        </KBtn>
        <KBtn wide="shift" align="end">
          shift
        </KBtn>
      </div>

      {/* Row 6 — bottom */}
      <div className="macbook__key-row">
        <KBtn split>
          <div className="macbook__key-split-row macbook__key-split-row--end">
            <span className="macbook__key-label">fn</span>
          </div>
          <div className="macbook__key-split-row macbook__key-split-row--start">
            <IconWorld className="macbook__key-icon" />
          </div>
        </KBtn>
        <KBtn split>
          <div className="macbook__key-split-row macbook__key-split-row--end">
            <IconChevronUp className="macbook__key-icon" />
          </div>
          <div className="macbook__key-split-row macbook__key-split-row--start">
            <span className="macbook__key-label">control</span>
          </div>
        </KBtn>
        <KBtn split>
          <div className="macbook__key-split-row macbook__key-split-row--end">
            <OptionKey />
          </div>
          <div className="macbook__key-split-row macbook__key-split-row--start">
            <span className="macbook__key-label">option</span>
          </div>
        </KBtn>
        <KBtn wide="w8" split>
          <div className="macbook__key-split-row macbook__key-split-row--end">
            <IconCommand className="macbook__key-icon" />
          </div>
          <div className="macbook__key-split-row macbook__key-split-row--start">
            <span className="macbook__key-label">command</span>
          </div>
        </KBtn>
        <KBtn wide="space" />
        <KBtn wide="w8" split>
          <div className="macbook__key-split-row macbook__key-split-row--start">
            <IconCommand className="macbook__key-icon" />
          </div>
          <div className="macbook__key-split-row macbook__key-split-row--start">
            <span className="macbook__key-label">command</span>
          </div>
        </KBtn>
        <KBtn split>
          <div className="macbook__key-split-row macbook__key-split-row--start">
            <OptionKey />
          </div>
          <div className="macbook__key-split-row macbook__key-split-row--start">
            <span className="macbook__key-label">option</span>
          </div>
        </KBtn>
        <div className="macbook__arrows">
          <KBtn half>
            <IconCaretUpFilled className="macbook__key-icon" />
          </KBtn>
          <div className="macbook__arrows-row">
            <KBtn half>
              <IconCaretLeftFilled className="macbook__key-icon" />
            </KBtn>
            <KBtn half>
              <IconCaretDownFilled className="macbook__key-icon" />
            </KBtn>
            <KBtn half>
              <IconCaretRightFilled className="macbook__key-icon" />
            </KBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

type KBtnWide = 'w10' | 'w8' | 'caps' | 'return' | 'shift' | 'space';
type KBtnAlign = 'start' | 'end';

interface KBtnProps {
  children?: React.ReactNode;
  wide?: KBtnWide;
  align?: KBtnAlign;
  split?: boolean;
  half?: boolean;
  backlit?: boolean;
}

export const KBtn = ({ children, wide, align, split, half, backlit = true }: KBtnProps) => {
  const outerClass = `macbook__key-outer${backlit ? ' macbook__key-outer--backlit' : ''}`;

  const innerClasses = [
    'macbook__key-inner',
    wide &&
      `macbook__key-inner--${wide === 'w10' ? 'w10' : wide === 'w8' ? 'w8' : wide === 'caps' ? 'w-caps' : wide === 'return' ? 'w-return' : wide === 'shift' ? 'w-shift' : 'w-space'}`,
    align === 'start' && 'macbook__key-inner--align-start',
    align === 'end' && 'macbook__key-inner--align-end',
    half && 'macbook__key-inner--half',
  ]
    .filter(Boolean)
    .join(' ');

  const contentClasses = [
    'macbook__key-content',
    backlit && 'macbook__key-content--backlit',
    align === 'start' && 'macbook__key-content--start',
    align === 'end' && 'macbook__key-content--end',
    split && 'macbook__key-content--split',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={outerClass}>
      <div className={innerClasses}>
        <div className={contentClasses}>{children}</div>
      </div>
    </div>
  );
};

export const SpeakerGrid = () => <div className="macbook__speaker-grid" />;

export const OptionKey = () => (
  <svg
    fill="none"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="macbook__option-svg"
  >
    <rect stroke="currentColor" strokeWidth={2} x="18" y="5" width="10" height="2" />
    <polygon
      stroke="currentColor"
      strokeWidth={2}
      points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25 "
    />
    <rect width="32" height="32" stroke="none" />
  </svg>
);

const AceternityLogo = () => (
  <svg
    width="66"
    height="65"
    viewBox="0 0 66 65"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="macbook__logo-svg"
  >
    <path
      d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
      stroke="currentColor"
      strokeWidth="15"
      strokeMiterlimit="3.86874"
      strokeLinecap="round"
    />
  </svg>
);
