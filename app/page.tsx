'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Rocket, Play, Calendar } from 'lucide-react';

export default function Home(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-b from-void via-cosmos to-void">
        {/* Simple starfield effect */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-1/4 left-1/4 h-1 w-1 bg-starlight rounded-full animate-twinkle" />
          <div className="absolute top-1/3 right-1/3 h-1 w-1 bg-starlight rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/2 h-1 w-1 bg-starlight rounded-full animate-twinkle" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/4 h-1 w-1 bg-starlight rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="container-custom relative z-10 text-center">
          <h1 className="mb-6 text-6xl font-bold md:text-7xl lg:text-8xl">
            <span className="text-gradient-space">RocketWatch</span>
          </h1>
          <p className="mb-4 text-2xl text-stardust md:text-3xl">For the love of space 🚀</p>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-stardust">
            Track every space launch, past, present, and future. Free forever, for everyone from
            5-year-olds to aerospace engineers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="large" variant="primary">
              <Rocket className="mr-2 h-5 w-5" />
              View Next Launch
            </Button>
            <Button size="large" variant="secondary">
              <Play className="mr-2 h-5 w-5" />
              Watch Live
            </Button>
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="container-custom py-16">
        <h2 className="mb-8 text-3xl font-bold text-starlight">Day 2 Components Complete ✨</h2>

        {/* Buttons */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold text-starlight">Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" loading>
              Loading
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold text-starlight">Status Badges</h3>
          <div className="flex flex-wrap gap-4">
            <Badge variant="live" pulse>
              LIVE
            </Badge>
            <Badge variant="upcoming">Upcoming</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="failure">Failure</Badge>
            <Badge variant="tbd">TBD</Badge>
            <Badge variant="partial">Partial Success</Badge>
          </div>
        </div>

        {/* Cards */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold text-starlight">Cards</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Next Launch</CardTitle>
                <CardDescription>SpaceX Falcon 9</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-stardust">
                  Starlink Group 6-29 launching from Cape Canaveral.
                </p>
                <Badge variant="upcoming">In 2 hours</Badge>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>With shadow effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-stardust">This card has a subtle elevation effect.</p>
              </CardContent>
            </Card>

            <Card variant="outlined" interactive>
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Hover to see effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-stardust">This card scales on hover.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status */}
        <div className="rounded-lg border border-nebula bg-cosmos p-6">
          <h3 className="mb-4 text-xl font-semibold text-starlight">✅ Day 2 Complete</h3>
          <ul className="space-y-2 text-stardust">
            <li>✓ Button component (all variants + loading state)</li>
            <li>✓ Badge component (status indicators)</li>
            <li>✓ Card component (with subcomponents)</li>
            <li>✓ Spinner component</li>
            <li>✓ Header with navigation</li>
            <li>✓ Footer</li>
            <li>✓ Mobile menu</li>
            <li>✓ Age mode toggle (try it in the header!)</li>
            <li>✓ Zustand stores (preferences + UI)</li>
            <li>✓ TanStack Query provider</li>
          </ul>
          <div className="mt-6">
            <Button variant="primary">
              <Calendar className="mr-2 h-4 w-4" />
              Ready for Day 3
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
