'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard' },
  { href: '/beo/kitchen', label: 'Kitchen' },
  { href: '/beo/service', label: 'Service' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname.startsWith(href);
}

export default function TopNav() {
  const pathname = usePathname();

  return (
    <ul className="grid w-full grid-cols-3 gap-1 rounded-lg bg-stone-100/75 p-1 sm:flex sm:w-auto sm:bg-transparent sm:p-0">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                'inline-flex min-h-[44px] w-full items-center justify-center rounded-md px-3 text-sm transition',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2',
                active
                  ? 'bg-white text-teal-800 shadow-sm ring-1 ring-stone-300 sm:bg-stone-100 sm:ring-stone-300'
                  : 'text-stone-700 hover:bg-white hover:text-teal-800 sm:hover:bg-stone-100'
              )}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
