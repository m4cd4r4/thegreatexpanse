'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useUIStore } from '@/lib/stores/ui';
import { useUserPreferences } from '@/lib/stores/preferences';
import { AgeModeToggle } from './age-mode-toggle';
import { Rocket, Menu, X } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  hideInExplorer?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/launches', label: 'Launches' },
  { href: '/live', label: 'Live' },
  { href: '/explorers', label: 'Agencies', hideInExplorer: true },
  { href: '/vehicles', label: 'Vehicles', hideInExplorer: true },
];

export function Header(): JSX.Element {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { ageMode } = useUserPreferences();

  // Filter nav links based on age mode
  const visibleLinks = NAV_LINKS.filter(
    (link) => ageMode !== 'explorer' || !link.hideInExplorer
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-nebula glass-medium">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Rocket className="h-6 w-6 text-rocket-orange" />
            <span className="font-display text-xl font-bold text-starlight">RocketWatch</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-starlight',
                  pathname === link.href ? 'text-starlight' : 'text-stardust'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Age Mode Toggle (Desktop) */}
            <div className="hidden lg:block">
              <AgeModeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-stardust hover:bg-white/5 hover:text-starlight transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
