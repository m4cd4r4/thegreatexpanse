'use client';

import { useUserPreferences } from '@/lib/stores/preferences';
import { cn } from '@/lib/utils/cn';
import type { AgeMode } from '@/types/common';
import { Sparkles, Rocket, Radar } from 'lucide-react';

interface AgeModeOption {
  mode: AgeMode;
  label: string;
  icon: typeof Sparkles;
  description: string;
}

const AGE_MODE_OPTIONS: AgeModeOption[] = [
  {
    mode: 'explorer',
    label: 'Explorer',
    icon: Sparkles,
    description: '5-8 years',
  },
  {
    mode: 'cadet',
    label: 'Cadet',
    icon: Rocket,
    description: '9-13 years',
  },
  {
    mode: 'missionControl',
    label: 'Mission Control',
    icon: Radar,
    description: '14+ years',
  },
];

export function AgeModeToggle(): JSX.Element {
  const { ageMode, setAgeMode } = useUserPreferences();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-nebula p-1">
      {AGE_MODE_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = ageMode === option.mode;

        return (
          <button
            key={option.mode}
            onClick={() => setAgeMode(option.mode)}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plasma-blue focus-visible:ring-offset-2 focus-visible:ring-offset-nebula',
              {
                'bg-plasma-blue text-white shadow-md': isActive,
                'text-stardust hover:bg-white/5 hover:text-starlight': !isActive,
              }
            )}
            aria-pressed={isActive}
            title={option.description}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden md:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
