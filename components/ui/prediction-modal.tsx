'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, MapPin, Calendar, Info, Target } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { Button } from './button';
import { Badge } from './badge';
import type { RoadClosure } from '@/types/prediction';
import { useUserPreferences } from '@/lib/stores/preferences';

interface PredictionModalProps {
  closure: RoadClosure | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * PredictionModal - Detailed view of road closure prediction
 *
 * Features:
 * - Shows road closure details
 * - Displays prediction with confidence percentage
 * - Shows reasoning and algorithm details
 * - Age-adapted content
 * - Focus trap for accessibility
 * - ESC key to close
 */
export function PredictionModal({ closure, isOpen, onClose }: PredictionModalProps): JSX.Element {
  const { ageMode } = useUserPreferences();
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap and initial focus
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modalElement = modalRef.current;
    const focusableElements = modalElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element when modal opens
    firstElement?.focus();

    // Trap focus within modal
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modalElement.addEventListener('keydown', handleTab as EventListener);
    return () => modalElement.removeEventListener('keydown', handleTab as EventListener);
  }, [isOpen]);

  if (!closure) return <></>;

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 75) return 'text-aurora-teal';
    if (confidence >= 50) return 'text-plasma-blue';
    if (confidence >= 25) return 'text-solar-gold';
    return 'text-mars-red';
  };

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 75) return 'success';
    if (confidence >= 50) return 'upcoming';
    return 'tbd';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-void/80 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2"
          >
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              className={cn(
                'mx-4 rounded-2xl border border-plasma-blue/20 bg-cosmos shadow-2xl',
                'max-h-[90vh] overflow-y-auto'
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-nebula p-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-6 w-6 text-plasma-blue" aria-hidden="true" />
                    <h2 id="modal-title" className="text-2xl font-bold text-starlight">
                      {ageMode === 'explorer'
                        ? '🔮 Launch Prediction'
                        : ageMode === 'cadet'
                        ? 'Launch Prediction'
                        : 'Predictive Analysis'}
                    </h2>
                  </div>
                  {closure.prediction && (
                    <Badge variant={getConfidenceBadgeVariant(closure.prediction.confidence)}>
                      {closure.prediction.confidence}% Confidence
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="small" onClick={onClose} aria-label="Close modal">
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Road Closure Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-starlight flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-aurora-teal" />
                    Road Closure Details
                  </h3>

                  <div className="grid gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-stardust font-medium min-w-24">Location:</span>
                      <span className="text-starlight">
                        {closure.location.name}, {closure.location.region}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-stardust font-medium min-w-24">Period:</span>
                      <span className="text-starlight">
                        {format(new Date(closure.startDate), 'MMM d, yyyy h:mm a')}
                        {' → '}
                        {format(new Date(closure.endDate), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-stardust font-medium min-w-24">Duration:</span>
                      <span className="text-starlight">
                        {Math.round(
                          (new Date(closure.endDate).getTime() -
                            new Date(closure.startDate).getTime()) /
                            (1000 * 60 * 60)
                        )}{' '}
                        hours
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-stardust font-medium min-w-24">Source:</span>
                      <span className="text-starlight">{closure.source}</span>
                    </div>
                  </div>
                </div>

                {/* Prediction Details */}
                {closure.prediction && (
                  <>
                    <div className="h-px bg-nebula" />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-starlight flex items-center gap-2">
                        <Target className="h-5 w-5 text-plasma-blue" />
                        Predicted Event
                      </h3>

                      <div
                        className={cn(
                          'rounded-lg border border-plasma-blue/20 bg-plasma-blue/5 p-4',
                          'space-y-3'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-semibold text-starlight">
                            {closure.prediction.predictedEvent}
                          </span>
                          <span
                            className={cn(
                              'text-3xl font-bold',
                              getConfidenceColor(closure.prediction.confidence)
                            )}
                          >
                            {closure.prediction.confidence}%
                          </span>
                        </div>

                        {closure.prediction.predictedVehicle && (
                          <div className="text-sm text-stardust">
                            Vehicle: <span className="text-starlight font-medium">
                              {closure.prediction.predictedVehicle.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Reasoning */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-starlight flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          {ageMode === 'explorer'
                            ? 'Why we think this:'
                            : ageMode === 'cadet'
                            ? 'Prediction Reasoning'
                            : 'Algorithmic Analysis'}
                        </h4>
                        <ul className="space-y-2">
                          {closure.prediction.reasoning.map((reason, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-stardust"
                            >
                              <span className="text-aurora-teal mt-0.5">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Algorithm Version (Mission Control only) */}
                      {ageMode === 'missionControl' && (
                        <div className="text-xs text-stardust pt-2 border-t border-nebula">
                          Algorithm: {closure.prediction.algorithmVersion} | Generated:{' '}
                          {format(
                            new Date(closure.prediction.generatedAt),
                            'MMM d, yyyy h:mm a'
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-nebula p-6 bg-void/50">
                <p className="text-sm text-stardust text-center">
                  {ageMode === 'explorer'
                    ? '✨ Predictions are our best guess based on road closures'
                    : ageMode === 'cadet'
                    ? 'Predictions are based on historical patterns and may not be 100% accurate'
                    : 'Algorithmic predictions based on road closure patterns, historical data, and launch site activity. Not guaranteed.'}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
