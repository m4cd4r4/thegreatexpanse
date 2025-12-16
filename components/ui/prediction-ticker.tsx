'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useUserPreferences } from '@/lib/stores/preferences';
import type { ActivePredictionsResponse, RoadClosure } from '@/types/prediction';
import { format } from 'date-fns';
import { PredictionModal } from './prediction-modal';

async function fetchPredictions(): Promise<ActivePredictionsResponse> {
  const response = await fetch('/api/predictions');
  if (!response.ok) {
    throw new Error('Failed to fetch predictions');
  }
  return response.json();
}

interface PredictionTickerProps {
  className?: string;
}

/**
 * PredictionTicker - Scrolling banner showing road closure predictions
 *
 * Features:
 * - Auto-scrolling ticker with predictions
 * - Pause on hover
 * - Click to open prediction modal
 * - Hidden in Explorer mode (age-adapted)
 * - Shows confidence percentage and predicted event
 */
export function PredictionTicker({ className }: PredictionTickerProps): JSX.Element | null {
  const { ageMode } = useUserPreferences();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<RoadClosure | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['predictions', 'active'],
    queryFn: fetchPredictions,
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    staleTime: 10 * 60 * 1000, // Consider stale after 10 minutes
  });

  // Hide in Explorer mode
  if (ageMode === 'explorer') {
    return null;
  }

  // Don't show if no predictions
  if (!data || data.roadClosures.length === 0) {
    return null;
  }

  const handleTickerClick = (closure: RoadClosure) => {
    setSelectedPrediction(closure);
  };

  return (
    <>
      <div
        className={cn(
          'h-9 bg-gradient-to-r from-plasma-blue/10 via-aurora-teal/10 to-plasma-blue/10 border-b border-plasma-blue/20',
          'flex items-center overflow-hidden relative',
          className
        )}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 px-4 text-sm text-stardust">
            <TrendingUp className="h-4 w-4 animate-pulse" />
            <span>Loading predictions...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 px-4 text-sm text-mars-red">
            <AlertCircle className="h-4 w-4" />
            <span>Unable to load predictions</span>
          </div>
        ) : (
          <div
            className={cn(
              'flex items-center gap-8 px-4 whitespace-nowrap',
              !isPaused && 'animate-ticker'
            )}
          >
            {/* Duplicate items for seamless loop */}
            {[...data.roadClosures, ...data.roadClosures].map((closure, index) => (
              <button
                key={`${closure.id}-${index}`}
                onClick={() => handleTickerClick(closure)}
                className={cn(
                  'flex items-center gap-3 text-sm transition-colors hover:text-plasma-blue',
                  'focus:outline-none focus:text-plasma-blue'
                )}
              >
                <TrendingUp className="h-4 w-4 text-aurora-teal flex-shrink-0" />
                <span className="text-starlight">
                  Road closure at{' '}
                  <span className="font-semibold text-white">{closure.location.name}</span>
                  {' '}
                  {format(new Date(closure.startDate), 'MMM d')}
                  {closure.endDate && ` - ${format(new Date(closure.endDate), 'MMM d')}`}
                </span>
                {closure.prediction && (
                  <>
                    <span className="text-stardust">→</span>
                    <span className="font-medium text-plasma-blue">
                      {closure.prediction.confidence}% {closure.prediction.predictedEvent}
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Prediction Modal */}
      <PredictionModal
        closure={selectedPrediction}
        isOpen={selectedPrediction !== null}
        onClose={() => setSelectedPrediction(null)}
      />
    </>
  );
}
