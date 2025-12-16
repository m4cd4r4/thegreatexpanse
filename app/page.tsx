import { HeroSection } from '@/components/home/hero-section';
import { StatusBar } from '@/components/home/status-bar';
import { UpcomingLaunches } from '@/components/home/upcoming-launches';

export default function Home(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section with Live Data */}
      <HeroSection />

      {/* Status Bar */}
      <StatusBar />

      {/* Upcoming Launches */}
      <UpcomingLaunches />
    </div>
  );
}
