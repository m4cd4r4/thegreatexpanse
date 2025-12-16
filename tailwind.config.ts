import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base Colors
        void: '#0a0e1a',
        cosmos: '#0f1629',
        nebula: '#1a1f36',
        stardust: '#9ca3af',
        starlight: '#f1f5f9',

        // Accent Colors
        'rocket-orange': '#f97316',
        'plasma-blue': '#3b82f6',
        'aurora-teal': '#14b8a6',
        'nebula-purple': '#8b5cf6',
        'solar-gold': '#eab308',
        'mars-red': '#ef4444',
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'countdown-hero': ['6rem', { lineHeight: '1', fontWeight: '700' }],
        'countdown-large': ['3rem', { lineHeight: '1', fontWeight: '700' }],
        'countdown-medium': ['1.5rem', { lineHeight: '1', fontWeight: '600' }],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
