'use client';

import { useEffect, useRef } from 'react';
import { useUserPreferences } from '@/lib/stores/preferences';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface StarfieldProps {
  starCount?: number;
  enableTwinkle?: boolean;
  parallaxIntensity?: number;
}

export function Starfield({
  starCount = 200,
  enableTwinkle = true,
  parallaxIntensity = 0.5,
}: StarfieldProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>();
  const { reducedMotion } = useUserPreferences();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize stars
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      starsRef.current.forEach((star) => {
        // Update twinkle
        if (enableTwinkle && !reducedMotion) {
          star.twinklePhase += star.twinkleSpeed;
          star.opacity = 0.3 + Math.sin(star.twinklePhase) * 0.4;
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(241, 245, 249, ${star.opacity})`; // starlight color
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    if (!reducedMotion) {
      animate();
    } else {
      // Static stars for reduced motion
      starsRef.current.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(241, 245, 249, ${star.opacity})`;
        ctx.fill();
      });
    }

    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return;

      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const deltaX = (clientX - centerX) * parallaxIntensity * 0.01;
      const deltaY = (clientY - centerY) * parallaxIntensity * 0.01;

      starsRef.current.forEach((star, index) => {
        const parallaxFactor = (index % 3) / 3; // Different layers
        star.x += deltaX * parallaxFactor;
        star.y += deltaY * parallaxFactor;

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [starCount, enableTwinkle, parallaxIntensity, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
