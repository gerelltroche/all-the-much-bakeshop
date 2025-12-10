import type { Metadata } from 'next';
import { Gabriela, Fraunces } from 'next/font/google';
import { DropCarousel, Drop, MediaItem } from './DropCarousel';
import { getDropsWithStatus } from './actions';

type OrderType = 'individual' | 'group' | 'business';

// UI-specific data that doesn't live in the database
interface DropUIData {
  emoji: string;
  borderColor: string;
  gradient: string;
  media: MediaItem[];
  flavor: string;
}

const dropUIData: Record<string, DropUIData> = {
  'candy-cane-lane': {
    emoji: '🍭',
    borderColor: 'border-rose-200 hover:border-rose-300',
    gradient: 'from-red-400 to-green-400',
    media: [
      { type: 'video', src: '/products/candy_cane_lane/greeting-card.mp4' },
      { type: 'image', src: '/products/candy_cane_lane/dozen.jpg' },
      { type: 'image', src: '/products/candy_cane_lane/half-dozen.jpg' },
    ],
    flavor: 'Triple Chocolate Peppermint Bark',
  },
  'cant-catch-me': {
    emoji: '🧑‍🍳',
    borderColor: 'border-amber-200 hover:border-amber-300',
    gradient: 'from-amber-600 to-amber-400',
    media: [
      { type: 'video', src: '/products/cant_catch_me/greeting-card.mp4' },
      { type: 'image', src: '/products/cant_catch_me/dozen.jpg' },
      { type: 'image', src: '/products/cant_catch_me/half-dozen.jpg' },
    ],
    flavor: 'Gingerbread',
  },
  'sweater-weather': {
    emoji: '🥧',
    borderColor: 'border-rose-200 hover:border-rose-300',
    gradient: 'from-rose-400 to-amber-400',
    media: [
      { type: 'video', src: '/products/sweater_weather/greeting-card.mp4' },
      { type: 'image', src: '/products/sweater_weather/dozen.jpg' },
      { type: 'image', src: '/products/sweater_weather/half-dozen.jpg' },
    ],
    flavor: 'Apple Pie a La Mode',
  },
  'superbowl': {
    emoji: '🏈',
    borderColor: 'border-rose-200',
    gradient: 'from-blue-500 to-red-500',
    media: [
      { type: 'image', src: '/products/superbowl_cookie_preview.jpg' },
    ],
    flavor: 'TBA',
  },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

const gabriela = Gabriela({
  weight: '400',
  subsets: ['latin']
});

const fraunces = Fraunces({
  weight: '600',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Winter Drops 2025-26 - All the Much Bake Shop',
  description: 'Order from our Winter 2025-26 drop schedule',
};

interface WinterDropsPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function WinterDropsPage({ searchParams }: WinterDropsPageProps) {
  const params = await searchParams;
  const typeParam = params.type;
  const orderType: OrderType = (typeParam === 'group' || typeParam === 'business') ? typeParam : 'individual';

  // Fetch drops from database and merge with UI data
  const dbDrops = await getDropsWithStatus();
  const drops: Drop[] = dbDrops
    .filter(dbDrop => dropUIData[dbDrop.slug]) // Only show drops we have UI data for
    .map(dbDrop => {
      const uiData = dropUIData[dbDrop.slug];
      return {
        id: dbDrop.slug,
        name: dbDrop.name,
        emoji: uiData.emoji,
        href: `/drops/${dbDrop.slug}/order`,
        borderColor: uiData.borderColor,
        gradient: uiData.gradient,
        media: uiData.media,
        flavor: uiData.flavor,
        dropCloses: dbDrop.isComingSoon ? 'TBA' : formatDate(dbDrop.cutoffDate),
        pickupDate: dbDrop.isComingSoon ? 'TBA' : formatDate(dbDrop.pickupDate),
        comingSoon: dbDrop.isComingSoon,
        isClosed: dbDrop.isClosed,
        dropOpens: dbDrop.dropOpens,
      };
    })
    .sort((a, b) => {
      // Priority: open drops first, then closed, then coming soon
      const getPriority = (drop: Drop) => {
        if (drop.comingSoon) return 2; // Coming soon at bottom
        if (drop.isClosed) return 1;   // Closed in middle
        return 0;                       // Open at top
      };
      const priorityDiff = getPriority(a) - getPriority(b);
      if (priorityDiff !== 0) return priorityDiff;
      // Within same priority, sort by dropOpens date
      return a.dropOpens.getTime() - b.dropOpens.getTime();
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 py-12 px-4 relative overflow-hidden">
      {/* Background decorative polka dots */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Larger polka dots */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-rose-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-32 right-20 w-32 h-32 bg-amber-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-rose-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Additional medium polka dots */}
        <div className="absolute top-40 right-32 w-12 h-12 bg-amber-300 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-20 left-24 w-16 h-16 bg-rose-200 rounded-full opacity-18 animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/4 w-14 h-14 bg-amber-200 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-18 h-18 bg-rose-300 rounded-full opacity-18 animate-pulse" style={{ animationDelay: '3s' }} />

        {/* Smaller scattered polka dots */}
        <div className="absolute top-32 left-1/3 w-8 h-8 bg-amber-200 rounded-full opacity-12 animate-pulse" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-3/4 left-16 w-10 h-10 bg-rose-200 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1.8s' }} />
        <div className="absolute top-1/4 right-16 w-10 h-10 bg-amber-300 rounded-full opacity-12 animate-pulse" style={{ animationDelay: '2.2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-rose-300 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '2.8s' }} />
        <div className="absolute top-2/3 right-1/3 w-12 h-12 bg-amber-200 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '3.5s' }} />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-5xl font-bold text-amber-900 mb-4 ${fraunces.className}`}>
            Winter 2025-26<br />
            Drop Schedule
          </h1>
          <p className={`text-amber-700 ${gabriela.className}`}>
            Pre-order your favorite seasonal treats 🍪
          </p>
        </div>

        {/* Drop Links */}
        <div className="space-y-6">
          {drops.map((drop) => (
            <DropCarousel
              key={drop.id}
              drop={drop}
              orderType={orderType}
              gabrielaClassName={gabriela.className}
              tangerineClassName={fraunces.className}
            />
          ))}
        </div>

        {/* Back to link tree */}
        <div className="mt-8 text-center">
          <a
            href="/link-tree"
            className={`text-amber-700 hover:text-amber-900 transition-colors ${gabriela.className}`}
          >
            ← Back to Links
          </a>
        </div>
      </div>

    </div>
  );
}
