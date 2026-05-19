import Link from 'next/link';
import Image from 'next/image';
import './Logo.less';

interface LogoProps {
  href: string;
  className?: string;
  onClick?: () => void;
}

export const Logo = ({ href, className = '', onClick }: LogoProps) => {
  return (
    <Link href={href} className={`logo ${className}`} onClick={onClick}>
      <Image
        src="/logo.svg"
        alt="Be Marvelous Digital"
        width={36}
        height={36}
        className="logo__mark"
        priority
      />
      <span className="logo__text">Be Marvelous Digital</span>
    </Link>
  );
};
