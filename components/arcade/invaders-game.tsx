'use client';

import { useEffect, useRef, useState } from 'react';
import { useUserPreferences } from '@/lib/stores/preferences';

interface InvadersGameProps {
  onClose: () => void;
  onBack: () => void;
}

interface Player {
  x: number;
  width: number;
  height: number;
}

interface Alien {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
}

interface Bullet {
  x: number;
  y: number;
  velocity: number;
}

export function InvadersGame({ onClose, onBack }: InvadersGameProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [paused, setPaused] = useState(false);
  const { ageMode } = useUserPreferences();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Difficulty settings
    const difficulty = {
      explorer: { rows: 3, cols: 6, alienSpeed: 15, shootChance: 0.0003 },
      cadet: { rows: 4, cols: 8, alienSpeed: 12, shootChance: 0.0005 },
      missionControl: { rows: 5, cols: 10, alienSpeed: 10, shootChance: 0.0008 },
    }[ageMode];

    // Game state
    const player: Player = {
      x: canvas.width / 2 - 20,
      width: 40,
      height: 30,
    };

    const aliens: Alien[] = [];
    const playerBullets: Bullet[] = [];
    const alienBullets: Bullet[] = [];
    const keys: { [key: string]: boolean } = {};

    let alienDirection = 1;
    let alienMoveCounter = 0;
    let lastShot = 0;

    // Initialize aliens
    const alienWidth = 30;
    const alienHeight = 25;
    const spacing = 15;
    const startX = (canvas.width - (difficulty.cols * (alienWidth + spacing) - spacing)) / 2;
    const startY = 60;

    for (let row = 0; row < difficulty.rows; row++) {
      for (let col = 0; col < difficulty.cols; col++) {
        aliens.push({
          x: startX + col * (alienWidth + spacing),
          y: startY + row * (alienHeight + spacing),
          width: alienWidth,
          height: alienHeight,
          alive: true,
        });
      }
    }

    // Input handling
    function handleKeyDown(e: KeyboardEvent) {
      keys[e.key] = true;
      if (e.key === ' ') {
        e.preventDefault();
        if (!canvas) return;
        const now = Date.now();
        if (now - lastShot > 500) {
          playerBullets.push({
            x: player.x + player.width / 2,
            y: canvas.height - player.height - 10,
            velocity: -8,
          });
          lastShot = now;
        }
      }
      if (e.key === 'Escape') {
        setPaused((p) => !p);
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      keys[e.key] = false;
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Game loop
    let animationFrameId: number;

    function gameLoop() {
      if (paused || gameOver || won || !ctx || !canvas) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      // Clear canvas
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update player
      if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= 5;
      }
      if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += 5;
      }

      // Draw player
      ctx.fillStyle = '#ff6b2c';
      ctx.fillRect(player.x, canvas.height - player.height - 10, player.width, player.height);

      // Update and move aliens
      alienMoveCounter++;
      if (alienMoveCounter >= difficulty.alienSpeed) {
        alienMoveCounter = 0;

        // Check if any alien hit the edge
        const aliveAliens = aliens.filter((a) => a.alive);
        const leftmost = Math.min(...aliveAliens.map((a) => a.x));
        const rightmost = Math.max(...aliveAliens.map((a) => a.x + a.width));

        if (leftmost <= 0 || rightmost >= canvas.width) {
          alienDirection *= -1;
          // Move down
          aliens.forEach((alien) => {
            if (alien.alive) alien.y += 20;
          });
        }

        // Move aliens horizontally
        aliens.forEach((alien) => {
          if (alien.alive) {
            alien.x += alienDirection * 10;
          }
        });
      }

      // Draw aliens
      aliens.forEach((alien) => {
        if (!alien.alive) return;

        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(alien.x, alien.y, alien.width, alien.height);

        // Draw alien eyes
        ctx.fillStyle = '#ff6b2c';
        ctx.fillRect(alien.x + 8, alien.y + 8, 4, 4);
        ctx.fillRect(alien.x + 18, alien.y + 8, 4, 4);

        // Aliens shoot randomly
        if (Math.random() < difficulty.shootChance) {
          alienBullets.push({
            x: alien.x + alien.width / 2,
            y: alien.y + alien.height,
            velocity: 4,
          });
        }

        // Check if alien reached bottom
        if (alien.y + alien.height >= canvas.height - player.height - 20) {
          setGameOver(true);
        }
      });

      // Update and draw player bullets
      for (let i = playerBullets.length - 1; i >= 0; i--) {
        const bullet = playerBullets[i];
        bullet.y += bullet.velocity;

        if (bullet.y < 0) {
          playerBullets.splice(i, 1);
          continue;
        }

        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(bullet.x - 2, bullet.y, 4, 10);

        // Check collision with aliens
        for (const alien of aliens) {
          if (
            alien.alive &&
            bullet.x > alien.x &&
            bullet.x < alien.x + alien.width &&
            bullet.y > alien.y &&
            bullet.y < alien.y + alien.height
          ) {
            alien.alive = false;
            playerBullets.splice(i, 1);
            setScore((s) => s + 100);
            break;
          }
        }
      }

      // Update and draw alien bullets
      for (let i = alienBullets.length - 1; i >= 0; i--) {
        const bullet = alienBullets[i];
        bullet.y += bullet.velocity;

        if (bullet.y > canvas.height) {
          alienBullets.splice(i, 1);
          continue;
        }

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(bullet.x - 2, bullet.y, 4, 10);

        // Check collision with player
        if (
          bullet.x > player.x &&
          bullet.x < player.x + player.width &&
          bullet.y > canvas.height - player.height - 10 &&
          bullet.y < canvas.height - 10
        ) {
          alienBullets.splice(i, 1);
          setLives((l) => {
            const newLives = l - 1;
            if (newLives <= 0) {
              setGameOver(true);
            }
            return newLives;
          });
        }
      }

      // Check win condition
      const aliveCount = aliens.filter((a) => a.alive).length;
      if (aliveCount === 0) {
        setWon(true);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [ageMode, paused, gameOver, won]);

  const handleRestart = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setWon(false);
    setPaused(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 sm:p-6 bg-void rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-[800px]">
        <button
          type="button"
          onClick={onBack}
          className="text-stardust hover:text-starlight transition-colors"
          aria-label="Back to game selection"
        >
          ← Back
        </button>
        <div className="flex items-center gap-6">
          <div className="text-starlight">
            <span className="text-sm text-stardust">Score:</span>{' '}
            <span className="text-xl font-bold">{score}</span>
          </div>
          <div className="text-starlight">
            <span className="text-sm text-stardust">Lives:</span>{' '}
            <span className="text-xl font-bold">{'🚀'.repeat(lives)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-stardust hover:text-starlight transition-colors text-2xl"
          aria-label="Close game"
        >
          ×
        </button>
      </div>

      {/* Canvas */}
      <div className="relative w-full max-w-[800px]">
        <canvas
          ref={canvasRef}
          className="border-2 border-nebula rounded-lg w-full"
          style={{ maxWidth: '100%', height: 'auto', aspectRatio: '4/3' }}
        />

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-void/90 rounded-lg">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-starlight">Game Over!</h2>
              <p className="text-xl text-stardust">Final Score: {score}</p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-6 py-3 bg-rocket-orange text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-3 bg-nebula text-starlight rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  Game Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {won && (
          <div className="absolute inset-0 flex items-center justify-center bg-void/90 rounded-lg">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-starlight">Victory!</h2>
              <p className="text-xl text-stardust">You saved Earth!</p>
              <p className="text-xl text-stardust">Final Score: {score}</p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-6 py-3 bg-rocket-orange text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-3 bg-nebula text-starlight rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  Game Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {paused && !gameOver && !won && (
          <div className="absolute inset-0 flex items-center justify-center bg-void/90 rounded-lg">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-starlight">Paused</h2>
              <p className="text-stardust">Press ESC to resume</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="text-center text-sm text-stardust space-y-1">
        <p>
          <kbd className="px-2 py-1 bg-nebula rounded">←</kbd> Move Left •{' '}
          <kbd className="px-2 py-1 bg-nebula rounded">→</kbd> Move Right
        </p>
        <p>
          <kbd className="px-2 py-1 bg-nebula rounded">Space</kbd> Shoot •{' '}
          <kbd className="px-2 py-1 bg-nebula rounded">ESC</kbd> Pause
        </p>
      </div>
    </div>
  );
}
