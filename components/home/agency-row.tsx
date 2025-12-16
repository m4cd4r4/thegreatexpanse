'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useUserPreferences } from '@/lib/stores/preferences';
import { cn } from '@/lib/utils/cn';
import type { AgencySummary } from '@/types/agency';

// Mock agency data (Phase 2 will fetch from API)
const MAJOR_AGENCIES: AgencySummary[] = [
  {
    id: '121',
    name: 'SpaceX',
    shortName: 'SpaceX',
    logo: 'https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_logo_20220826094313.png',
    countryCode: 'USA',
  },
  {
    id: '44',
    name: 'National Aeronautics and Space Administration',
    shortName: 'NASA',
    logo: 'https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/national2520aeronautics2520and2520space2520administration_logo_20190207032448.png',
    countryCode: 'USA',
  },
  {
    id: '27',
    name: 'European Space Agency',
    shortName: 'ESA',
    logo: 'https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/european2520space2520agency_logo_20190207032429.png',
    countryCode: 'EU',
  },
  {
    id: '63',
    name: 'Russian Federal Space Agency',
    shortName: 'Roscosmos',
    logo: 'https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/russian2520federal2520space2520agency_logo_20190207032459.png',
    countryCode: 'RUS',
  },
  {
    id: '17',
    name: 'China National Space Administration',
    shortName: 'CNSA',
    logo: 'https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/china2520national2520space2520administration_logo_20190207032424.png',
    countryCode: 'CHN',
  },
  {
    id: '141',
    name: 'Blue Origin',
    shortName: 'Blue Origin',
    logo: 'https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/blue2520origin_logo_20190207032427.png',
    countryCode: 'USA',
  },
  {
    id: '147',
    name: 'Rocket Lab',
    shortName: 'Rocket Lab',
    logo: 'https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/rocket2520lab_logo_20190207032501.png',
    countryCode: 'USA',
  },
  {
    id: '31',
    name: 'Japan Aerospace Exploration Agency',
    shortName: 'JAXA',
    logo: 'https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/japan2520aerospace2520exploration2520agency_logo_20190207032440.png',
    countryCode: 'JPN',
  },
];

/**
 * AgencyRow component for the homepage
 *
 * Features:
 * - Grid of major space agency logos
 * - Age-mode filtering (Explorer shows top 4, others show all)
 * - Hover effects with agency name
 * - Links to agency detail pages
 * - "View All" link to agencies directory
 */
export function AgencyRow(): JSX.Element {
  const { ageMode } = useUserPreferences();

  // Explorer mode shows fewer agencies (top 4)
  const displayedAgencies = ageMode === 'explorer'
    ? MAJOR_AGENCIES.slice(0, 4)
    : MAJOR_AGENCIES;

  return (
    <section className="bg-void py-16">
      <div className="container-custom">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-starlight">
              {ageMode === 'explorer' ? '🚀 Space Companies' : 'Explore by Agency'}
            </h2>
            <p className="mt-2 text-stardust">
              {ageMode === 'explorer'
                ? 'Learn about companies that build rockets'
                : ageMode === 'cadet'
                ? 'Discover space agencies and companies'
                : 'Browse launches by space agency and provider'}
            </p>
          </div>

          <Link
            href="/agencies"
            className="group flex items-center gap-2 text-plasma-blue transition-colors hover:text-aurora-teal"
          >
            <span className="hidden sm:inline">View All</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Agency Grid */}
        <div className={cn(
          'grid gap-6',
          ageMode === 'explorer'
            ? 'grid-cols-2 sm:grid-cols-4'
            : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8'
        )}>
          {displayedAgencies.map((agency) => (
            <Link
              key={agency.id}
              href={`/agencies/${agency.id}`}
              className="group relative aspect-square overflow-hidden rounded-lg bg-cosmos p-6 transition-all hover:scale-105 hover:bg-nebula hover:shadow-lg hover:shadow-plasma-blue/20"
            >
              {/* Agency Logo */}
              <div className="relative h-full w-full !pointer-events-none">
                <Image
                  src={agency.logo}
                  alt={agency.shortName || agency.name}
                  fill
                  className="object-contain p-2 transition-transform group-hover:scale-110 !pointer-events-none"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                  style={{ pointerEvents: 'none' }}
                />
              </div>

              {/* Agency Name Overlay (on hover) */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-void/90 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-center text-sm font-semibold text-starlight w-full">
                  {agency.shortName || agency.name}
                </p>
              </div>

              {/* Country Badge (top right) */}
              <div className="absolute right-2 top-2 rounded-full bg-nebula px-2 py-1 text-xs font-medium text-stardust opacity-0 transition-opacity group-hover:opacity-100">
                {agency.countryCode}
              </div>
            </Link>
          ))}
        </div>

        {/* Explorer Mode Note */}
        {ageMode === 'explorer' && (
          <div className="mt-6 text-center">
            <Link
              href="/agencies"
              className="inline-flex items-center gap-2 text-plasma-blue hover:text-aurora-teal transition-colors"
            >
              <span>See more space companies</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Note about mock data (remove in production) */}
        <div className="mt-6 text-center">
          <p className="text-xs text-stardust/60">
            Note: Agency logos are from The Space Devs. Phase 2 will fetch real data from Launch Library API.
          </p>
        </div>
      </div>
    </section>
  );
}
