'use client';

import { useState } from 'react';
import Link from 'next/link';
import { VideoCard } from '@/components/video/video-card';
import { VideoModal } from '@/components/video/video-modal';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useUserPreferences } from '@/lib/stores/preferences';
import { Radio, Play, Film, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Video, VideoCategory } from '@/types/video';

// Extended mock video data (will be replaced with API in Phase 2)
const MOCK_VIDEOS: Video[] = [
  {
    id: 'video-1',
    source: 'youtube',
    externalId: 'dQw4w9WgXcQ',
    title: '🔴 LIVE: SpaceX Starship Flight Test',
    description: 'Watch the latest Starship integrated flight test live from Starbase, Texas. This is the most powerful rocket ever built!',
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
    ageAppropriate: ['explorer', 'cadet', 'missionControl'],
  },
  {
    id: 'video-2',
    source: 'youtube',
    externalId: 'abc123',
    title: 'Falcon 9 Starlink Launch Highlights',
    description: 'Highlights from the recent Starlink mission, including incredible booster landing footage.',
    channel: {
      id: 'spacex',
      name: 'SpaceX',
      url: 'https://www.youtube.com/spacex',
    },
    thumbnailUrl: 'https://i.ytimg.com/vi/abc123/maxresdefault.jpg',
    duration: 180,
    publishedAt: new Date(Date.now() - 86400000),
    isLive: false,
    viewCount: 450230,
    category: 'launch',
    ageAppropriate: ['explorer', 'cadet', 'missionControl'],
  },
  {
    id: 'video-3',
    source: 'youtube',
    externalId: 'def456',
    title: 'Inside the Vehicle Assembly Building',
    description: 'An exclusive tour of NASA\'s massive Vehicle Assembly Building at Kennedy Space Center.',
    channel: {
      id: 'nasa',
      name: 'NASA',
      url: 'https://www.youtube.com/nasa',
    },
    thumbnailUrl: 'https://i.ytimg.com/vi/def456/maxresdefault.jpg',
    duration: 720,
    publishedAt: new Date(Date.now() - 172800000),
    isLive: false,
    viewCount: 892100,
    category: 'documentary',
    ageAppropriate: ['cadet', 'missionControl'],
  },
  {
    id: 'video-4',
    source: 'youtube',
    externalId: 'ghi789',
    title: 'How Rocket Engines Work',
    description: 'Learn about the fascinating physics and engineering behind rocket propulsion systems.',
    channel: {
      id: 'everyday-astronaut',
      name: 'Everyday Astronaut',
      url: 'https://www.youtube.com/everydayastronaut',
    },
    thumbnailUrl: 'https://i.ytimg.com/vi/ghi789/maxresdefault.jpg',
    duration: 1200,
    publishedAt: new Date(Date.now() - 259200000),
    isLive: false,
    viewCount: 1240500,
    category: 'educational',
    ageAppropriate: ['cadet', 'missionControl'],
  },
  {
    id: 'video-5',
    source: 'youtube',
    externalId: 'jkl012',
    title: 'Artemis Mission Update',
    description: 'Latest updates on NASA\'s Artemis program and the return to the Moon.',
    channel: {
      id: 'nasa',
      name: 'NASA',
      url: 'https://www.youtube.com/nasa',
    },
    thumbnailUrl: 'https://i.ytimg.com/vi/jkl012/maxresdefault.jpg',
    duration: 480,
    publishedAt: new Date(Date.now() - 345600000),
    isLive: false,
    viewCount: 678900,
    category: 'news',
    ageAppropriate: ['explorer', 'cadet', 'missionControl'],
  },
  {
    id: 'video-6',
    source: 'youtube',
    externalId: 'mno345',
    title: 'Blue Origin New Shepard Launch',
    description: 'Watch Blue Origin\'s suborbital rocket take tourists to the edge of space.',
    channel: {
      id: 'blue-origin',
      name: 'Blue Origin',
      url: 'https://www.youtube.com/blueorigin',
    },
    thumbnailUrl: 'https://i.ytimg.com/vi/mno345/maxresdefault.jpg',
    duration: 300,
    publishedAt: new Date(Date.now() - 432000000),
    isLive: false,
    viewCount: 234500,
    category: 'launch',
    ageAppropriate: ['explorer', 'cadet', 'missionControl'],
  },
];

const CATEGORIES: { value: VideoCategory | 'all'; label: string; icon: typeof Radio }[] = [
  { value: 'all', label: 'All Videos', icon: Film },
  { value: 'livestream', label: 'Live', icon: Radio },
  { value: 'launch', label: 'Launches', icon: Play },
  { value: 'educational', label: 'Educational', icon: GraduationCap },
  { value: 'documentary', label: 'Documentary', icon: Film },
  { value: 'news', label: 'News', icon: Film },
];

export default function VideosPage(): JSX.Element {
  const { ageMode } = useUserPreferences();
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'all'>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter videos by age appropriateness and category
  const filteredVideos = MOCK_VIDEOS.filter(video => {
    const ageMatch = video.ageAppropriate.includes(ageMode);
    const categoryMatch = selectedCategory === 'all' || video.category === selectedCategory;
    return ageMatch && categoryMatch;
  });

  // Separate live and regular videos
  const liveVideos = filteredVideos.filter(v => v.isLive);
  const regularVideos = filteredVideos.filter(v => !v.isLive);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing selected video to allow modal animation
    setTimeout(() => setSelectedVideo(null), 300);
  };

  return (
    <div className="container-custom py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-starlight mb-2">
          {ageMode === 'explorer' ? '📺 Watch Space Videos' : 'Videos'}
        </h1>
        <p className="text-stardust">
          {ageMode === 'explorer'
            ? 'Watch rockets launch and learn about space!'
            : ageMode === 'cadet'
            ? 'Live streams, launch highlights, and educational content'
            : 'Watch live launches, mission highlights, and space documentaries'}
        </p>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.value;

          return (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-rocket-orange text-starlight'
                  : 'bg-cosmos text-stardust hover:bg-nebula hover:text-starlight'
              )}
            >
              <Icon className="h-4 w-4" />
              {category.label}
              {category.value === 'livestream' && liveVideos.length > 0 && (
                <Badge variant="live" className="ml-1 animate-pulse">
                  {liveVideos.length}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Live Videos Section (if any) */}
      {liveVideos.length > 0 && (
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <Radio className="h-5 w-5 text-mars-red animate-pulse" />
            <h2 className="text-2xl font-semibold text-starlight">
              {ageMode === 'explorer' ? 'Live Right Now!' : 'Live Streams'}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveVideos.map((video) => (
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
      )}

      {/* Regular Videos Section */}
      {regularVideos.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-starlight">
            {liveVideos.length > 0
              ? ageMode === 'explorer'
                ? 'More Videos'
                : 'Recent Videos'
              : ageMode === 'explorer'
              ? 'All Videos'
              : 'Videos'}
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularVideos.map((video) => (
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
      )}

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Film className="h-16 w-16 text-stardust mb-4" />
          <h3 className="text-xl font-semibold text-starlight mb-2">No videos found</h3>
          <p className="text-stardust mb-6">
            Try selecting a different category or check back later for new content.
          </p>
          <Link
            href="/"
            className="text-plasma-blue hover:text-aurora-teal transition-colors"
          >
            Return to Home
          </Link>
        </div>
      )}

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Note about mock data */}
      <div className="mt-12 text-center">
        <p className="text-xs text-stardust/60">
          Note: Video data is currently mocked. Phase 2 will integrate YouTube Data API for real-time content.
        </p>
      </div>
    </div>
  );
}
