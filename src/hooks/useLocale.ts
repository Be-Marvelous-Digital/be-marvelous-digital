import { usePathname } from 'next/navigation';

export function useLocale(): 'en' | 'sk' {
  const pathname = usePathname();
  return pathname.startsWith('/en') ? 'en' : 'sk';
}
