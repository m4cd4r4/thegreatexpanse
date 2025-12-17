'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useUIStore } from '@/lib/stores/ui';
import { useUserPreferences } from '@/lib/stores/preferences';
import { AgeModeToggle } from './age-mode-toggle';
import { ArcadeModal } from '../arcade/arcade-modal';
import { Rocket, Menu, X, Gamepad2 } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  hideInExplorer?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/launches', label: 'Launches' },
  { href: '/live', label: 'Live' },
  { href: '/agencies', label: 'Agencies', hideInExplorer: true },
  { href: '/vehicles', label: 'Vehicles', hideInExplorer: true },
];

export function Header(): JSX.Element {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { ageMode } = useUserPreferences();
  const [arcadeOpen, setArcadeOpen] = useState(false);

  // Filter nav links based on age mode
  const visibleLinks = NAV_LINKS.filter(
    (link) => ageMode !== 'explorer' || !link.hideInExplorer
  );

  return (
    <header role="banner" className="sticky top-0 z-50 w-full border-b border-nebula glass-medium">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between md:h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="The Great Expanse home"
          >
            <Rocket className="h-6 w-6 text-rocket-orange" aria-hidden="true" />
            <span className="font-display text-xl font-bold text-starlight">The Great Expanse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-starlight',
                  pathname === link.href ? 'text-starlight' : 'text-stardust'
                )}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Arcade Button */}
            <button
              onClick={() => setArcadeOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stardust hover:bg-white/5 hover:text-starlight transition-colors"
              aria-label="Play Asteroids"
              title="Play while you wait!"
            >
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden md:inline">Arcade</span>
            </button>

            {/* Age Mode Toggle (Desktop) */}
            <div className="hidden lg:block">
              <AgeModeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-stardust hover:bg-white/5 hover:text-starlight transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Arcade Modal */}
      <ArcadeModal isOpen={arcadeOpen} onClose={() => setArcadeOpen(false)} />
    </header>
  );
}
