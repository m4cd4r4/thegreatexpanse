'use client';

import { useEffect } from 'react';
import { useUserPreferences } from '@/lib/stores/preferences';

/**
 * AgeModeProvider - Applies age mode data attribute to body
 *
 * This component reads the age mode from the Zustand store and applies
 * the corresponding data-age-mode attribute to the body element.
 * This enables age-specific CSS variables to take effect.
 */
export function AgeModeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { ageMode } = useUserPreferences();

  useEffect(() => {
    // Apply age mode to body
    document.body.setAttribute('data-age-mode', ageMode);

    // Cleanup on unmount
    return () => {
      document.body.removeAttribute('data-age-mode');
    };
  }, [ageMode]);

  return <>{children}</>;
}
