'use client';

import { useEffect } from 'react';
import { AsteroidsGame } from './asteroids-game';

interface ArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArcadeModal({ isOpen, onClose }: ArcadeModalProps): JSX.Element | null {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/95 backdrop-blur-sm overflow-auto"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="max-h-[95vh] overflow-auto">
        <AsteroidsGame onClose={onClose} />
      </div>
    </div>
  );
}
