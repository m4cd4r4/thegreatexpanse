'use client';

import { useState } from 'react';
import Link from 'next/link';
import { VideoCard } from '@/components/video/video-card';
import { VideoModal } from '@/components/video/video-modal';
import { Badge } from '@/components/ui/badge';
import { useUserPreferences } from '@/lib/stores/preferences';
import { Radio, ExternalLink, Calendar, Rocket } from 'lucide-react';
import type { Video } from '@/types/video';

// Mock live stream data (will be replaced with YouTube API in Phase 2)
const MOCK_LIVE_STREAMS: Video[] = [
  {
    id: 'live-1',
    source: 'youtube',
    externalId: 'dQw4w9WgXcQ',
    title: '🔴 LIVE: SpaceX Starship Flight Test',
    description: 'Watch the latest Starship integrated flight test live from Starbase, Texas. This is the most powerful rocket ever built attempting its orbital flight test.',
    channel: {
      id: 'spacex',
      name: 'SpaceX',
      url: 'https://www.youtube.com/spacex',
    },
    thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishedAt: new Date(),
    isLive: true,
    viewCount: 125430,
    category: 'livestream',
    relatedLaunchId: 'launch-123',
    ageAppropriate: ['explorer', 'cadet', 'missionControl'],
  },
  {
    id: 'live-2',
    source: 'youtube',
    externalId: 'xyz789',
    title: '🔴 LIVE: NASA ISS Stream',
    description: 'Live view from the International Space Station as it orbits Earth at 17,500 mph.',
    channel: {
      id: 'nasa',
      name: 'NASA',
      url: 'https://www.youtube.com/nasa',
    },
    thumbnailUrl: 'https://i.ytimg.com/vi/xyz789/maxresdefault.jpg',
    publishedAt: new Date(Date.now() - 3600000),
    isLive: true,
    viewCount: 45230,
    category: 'livestream',
    ageAppropriate: ['explorer', 'cadet', 'missionControl'],
  },
];

// Mock upcoming launches with webcasts
const MOCK_UPCOMING_WEBCASTS = [
  {
    id: 'upcoming-1',
    launchName: 'Falcon 9 • Starlink Group 6-32',
    provider: 'SpaceX',
    launchTime: new Date(Date.now() + 7200000), // 2 hours from now
    site: 'Cape Canaveral SLC-40',
    webcastUrl: 'https://www.youtube.com/spacex',
  },
  {
    id: 'upcoming-2',
    launchName: 'Electron • NROL-199',
    provider: 'Rocket Lab',
    launchTime: new Date(Date.now() + 14400000), // 4 hours from now
    site: 'Mahia LC-1A',
    webcastUrl: 'https://www.youtube.com/rocketlabusa',
  },
];

export default function LivePage(): JSX.Element {
  const { ageMode } = useUserPreferences();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter streams by age appropriateness
  const liveStreams = MOCK_LIVE_STREAMS.filter(video =>
    video.ageAppropriate.includes(ageMode)
  );

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  return (
    <div className="container-custom py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Radio className="h-8 w-8 text-mars-red animate-pulse" />
          <h1 className="text-4xl font-bold text-starlight">
            {ageMode === 'explorer' ? '🔴 Watch Live!' : 'Live Streams'}
          </h1>
        </div>
        <p className="text-stardust">
          {ageMode === 'explorer'
            ? 'Watch rocket launches and space stuff happening right now!'
            : ageMode === 'cadet'
            ? 'Watch live rocket launches and space events as they happen'
            : 'Live coverage of rocket launches, spacewalks, and space events'}
        </p>
      </div>

      {/* Live Streams Section */}
      {liveStreams.length > 0 ? (
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <Badge variant="live" className="animate-pulse">
              <Radio className="h-3 w-3" />
              {liveStreams.length} LIVE NOW
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveStreams.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video)}
                className="cursor-pointer"
              >
                <VideoCard video={video} variant="default" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-12">
          <div className="rounded-lg border-2 border-dashed border-nebula bg-cosmos/50 p-12 text-center">
            <Radio className="h-16 w-16 text-stardust mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-starlight mb-2">
              {ageMode === 'explorer'
                ? 'No Rockets Launching Right Now'
                : 'No Live Streams'}
            </h3>
            <p className="text-stardust mb-6">
              {ageMode === 'explorer'
                ? 'Check back soon for the next launch!'
                : 'There are no live streams at the moment. Check the upcoming webcasts below.'}
            </p>
            <Link
              href="/videos"
              className="text-plasma-blue hover:text-aurora-teal transition-colors"
            >
              Browse Recent Videos →
            </Link>
          </div>
        </section>
      )}

      {/* Upcoming Webcasts Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-starlight mb-2">
            {ageMode === 'explorer' ? 'Coming Up Soon' : 'Upcoming Webcasts'}
          </h2>
          <p className="text-stardust">
            {ageMode === 'explorer'
              ? 'These launches are happening soon!'
              : 'Scheduled launches with confirmed webcast coverage'}
          </p>
        </div>

        <div className="grid gap-4">
          {MOCK_UPCOMING_WEBCASTS.map((webcast) => {
            const hoursUntil = Math.floor((webcast.launchTime.getTime() - Date.now()) / (1000 * 60 * 60));
            const minutesUntil = Math.floor(((webcast.launchTime.getTime() - Date.now()) % (1000 * 60 * 60)) / (1000 * 60));

            return (
              <div
                key={webcast.id}
                className="group relative overflow-hidden rounded-lg bg-cosmos p-6 transition-all hover:bg-nebula hover:shadow-lg hover:shadow-plasma-blue/20"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  {/* Launch Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-starlight mb-2 group-hover:text-rocket-orange transition-colors">
                      {webcast.launchName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-stardust">
                      <div className="flex items-center gap-2">
                        <Rocket className="h-4 w-4" />
                        <span>{webcast.provider}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{webcast.site}</span>
                      </div>
                    </div>
                  </div>

                  {/* Time Until Launch */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-rocket-orange">
                        {hoursUntil}h {minutesUntil}m
                      </div>
                      <div className="text-xs text-stardust">
                        {ageMode === 'explorer' ? 'until launch' : 'T-'}
                      </div>
                    </div>

                    {/* Webcast Link */}
                    <a
                      href={webcast.webcastUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-plasma-blue text-starlight transition-all hover:scale-110 hover:bg-aurora-teal"
                      aria-label={`Watch ${webcast.launchName} webcast`}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA to Launches Page */}
      <div className="mt-12 rounded-lg bg-gradient-to-r from-rocket-orange/10 to-plasma-blue/10 p-8 text-center">
        <h3 className="text-xl font-semibold text-starlight mb-2">
          {ageMode === 'explorer'
            ? 'Want to See All Launches?'
            : 'View All Upcoming Launches'}
        </h3>
        <p className="text-stardust mb-4">
          {ageMode === 'explorer'
            ? 'See every rocket launch with countdowns!'
            : 'Browse all scheduled launches with detailed information and countdowns'}
        </p>
        <Link
          href="/launches"
          className="inline-flex items-center gap-2 rounded-lg bg-rocket-orange px-6 py-3 font-semibold text-starlight transition-all hover:scale-105 hover:bg-red-600"
        >
          <Rocket className="h-5 w-5" />
          {ageMode === 'explorer' ? 'See All Launches' : 'View Launch Schedule'}
        </Link>
      </div>

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Note about mock data */}
      <div className="mt-8 text-center">
        <p className="text-xs text-stardust/60">
          Note: Live stream data is currently mocked. Phase 2 will integrate YouTube Data API for real-time updates.
        </p>
      </div>
    </div>
  );
}
