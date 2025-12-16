import { HeroSection } from '@/components/home/hero-section';
import { StatusBar } from '@/components/home/status-bar';
import { UpcomingLaunches } from '@/components/home/upcoming-launches';
import { FeaturedVideos } from '@/components/home/featured-videos';
import { AgencyRow } from '@/components/home/agency-row';

export default function Home(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section with Live Data */}
      <HeroSection />

      {/* Status Bar */}
      <StatusBar />

      {/* Upcoming Launches */}
      <UpcomingLaunches />

      {/* Featured Videos */}
      <FeaturedVideos />

      {/* Explore by Agency */}
      <AgencyRow />
    </div>
  );
}
