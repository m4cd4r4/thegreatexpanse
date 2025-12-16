# RocketWatch 🚀

> For the love of space

A free, inclusive space launch tracking platform serving everyone from 5-year-olds to aerospace engineers.

## Progress

### ✅ Day 1 Complete - Project Setup
- Next.js 14 project initialized with TypeScript
- Tailwind CSS configured with custom design tokens
- Complete folder structure created
- Base utility files (cn.ts, common types)
- Global styles with CSS variables
- All dependencies installed

### ✅ Day 2 Complete - Component Library
- **UI Components**: Button, Badge, Card, Spinner
- **Layout Components**: Header, Footer, Mobile Menu, Age Mode Toggle
- **State Management**: Zustand stores (preferences, UI)
- **Providers**: TanStack Query setup
- **Full Layout**: Integrated header, footer, and navigation

See [DAY-2-SUMMARY.md](./DAY-2-SUMMARY.md) for detailed Day 2 documentation.

### Project Structure

```
rocketwatch/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Home page
│   ├── launches/          # Launch pages
│   ├── live/              # Live streams
│   ├── explorers/         # Agencies
│   ├── vehicles/          # Vehicles
│   └── api/               # API routes
├── components/
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── launch/            # Launch-specific
│   ├── video/             # Video components
│   ├── agency/            # Agency components
│   ├── vehicle/           # Vehicle components
│   └── home/              # Home page sections
├── lib/
│   ├── api/               # API client
│   ├── external/          # External API clients
│   ├── queries/           # TanStack Query hooks
│   ├── stores/            # Zustand stores
│   └── utils/             # Utility functions
├── types/                 # TypeScript types
├── styles/                # Global styles
└── public/                # Static assets
```

### Design System

**Color Palette:**
- `void` - #0a0e1a (deepest background)
- `cosmos` - #0f1629 (card backgrounds)
- `nebula` - #1a1f36 (elevated surfaces)
- `stardust` - #9ca3af (secondary text)
- `starlight` - #f1f5f9 (primary text)
- `rocket-orange` - #f97316 (primary CTA)
- `plasma-blue` - #3b82f6 (links, info)
- `aurora-teal` - #14b8a6 (success)
- `nebula-purple` - #8b5cf6 (highlights)
- `solar-gold` - #eab308 (warnings)
- `mars-red` - #ef4444 (errors, live)

**Typography:**
- Display: Space Grotesk
- Body: Inter
- Mono: JetBrains Mono

### Getting Started

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Copy `.env.local.example` to `.env.local` and add your API keys:

```env
LL2_API_KEY=your_launch_library_key
YOUTUBE_API_KEY=your_youtube_key
KV_REST_API_URL=your_upstash_url
KV_REST_API_TOKEN=your_upstash_token
```

### Next Steps (Day 3)

According to the roadmap in [SKILL.md](./SKILL.md), Day 3 focuses on:

1. **API Layer & Types**:
   - Launch, Agency, Vehicle, Video type definitions
   - Launch Library 2 API client
   - API route handlers
   - Query hooks with TanStack Query

2. **Data Management**:
   - Query key factory
   - Redis caching setup
   - Cache TTL strategy
   - Error handling

See [SKILL.md](./SKILL.md) for the complete specification and roadmap.

### Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3.4+
- **Animation:** Framer Motion
- **State Management:** Zustand + TanStack Query v5
- **Hosting:** Vercel
- **Cache:** Vercel KV / Upstash Redis

### Core Principles

- 🆓 Free forever
- 🌈 Inclusive (3 age modes)
- 🌍 Comprehensive (all agencies, all history)
- ♿ Accessible (WCAG AA)
- ✨ Delightful (beautiful dark UI)

---

**Built with love for space exploration** 🌌
