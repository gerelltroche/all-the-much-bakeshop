'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  generateEventId,
  getTrackingParams,
  trackSubscribePixel,
} from '@/lib/meta-pixel-client';

export type MediaType = 'image' | 'video';

export interface MediaItem {
  type: MediaType;
  src: string;
}

export interface Drop {
  id: string;
  name: string;
  emoji: string;
  href: string;
  borderColor: string;
  gradient: string;
  media: MediaItem[];
  flavor: string;
  dropCloses: string;
  pickupDate: string;
  comingSoon: boolean;
}

type OrderType = 'individual' | 'group' | 'business';

interface DropCarouselProps {
  drop: Drop;
  orderType: OrderType;
  gabrielaClassName: string;
  tangerineClassName: string;
}

export function DropCarousel({ drop, orderType, gabrielaClassName, tangerineClassName }: DropCarouselProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement>(null);

  // Build href with orderType param
  const dropHref = drop.comingSoon ? '#' : `${drop.href}?type=${orderType}`;
  const [notifyEmail, setNotifyEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const currentMedia = drop.media[currentMediaIndex];

  // Handle video autoplay when visible
  useEffect(() => {
    if (currentMedia?.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentMediaIndex, currentMedia?.type]);

  // Handle lightbox video autoplay
  useEffect(() => {
    if (isLightboxOpen && currentMedia?.type === 'video' && lightboxVideoRef.current) {
      lightboxVideoRef.current.play().catch(() => {});
    }
  }, [isLightboxOpen, currentMediaIndex, currentMedia?.type]);

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % drop.media.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + drop.media.length) % drop.media.length);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Generate event_id for deduplication and get tracking params
    const eventId = generateEventId();
    const trackingParams = getTrackingParams(eventId);

    // Fire browser pixel event
    trackSubscribePixel(eventId);

    try {
      const response = await fetch('/api/notify-me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: notifyEmail,
          dropId: drop.id,
          ...trackingParams,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setNotifyEmail('');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (drop.comingSoon) {
    return (
      <div className={`block w-full bg-white rounded-2xl shadow-md border-2 ${drop.borderColor} relative overflow-hidden`}>
        {/* Coming Soon Ribbon */}
        <div className="absolute top-4 -left-10 bg-red-800 text-white pl-8 pr-12 py-1 -rotate-45 shadow-lg z-10">
          <span className="text-xs font-bold">COMING SOON</span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 p-5">
          {/* Blurred teaser media */}
          <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {drop.media[0]?.type === 'video' ? (
              <video
                src={drop.media[0].src}
                className="w-full h-full object-cover"
                style={{ filter: 'blur(4px)' }}
                muted
                loop
                playsInline
                autoPlay
              />
            ) : (
              <Image
                src={drop.media[0]?.src || ''}
                alt="Coming soon"
                fill
                className="object-cover"
                style={{ filter: 'blur(4px)' }}
                sizes="(max-width: 768px) 100vw, 192px"
              />
            )}
            {/* Optional overlay for extra "mystery" effect */}
            <div className="absolute inset-0 bg-white/20" />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col gap-3 justify-between">
            <div className="flex flex-col gap-3">
              <div>
                <div className={`text-4xl font-bold text-amber-900 ${tangerineClassName} mb-2`}>
                  {drop.name}
                </div>
                <div className={`text-md text-amber-700 ${gabrielaClassName} mb-2`}>
                  Game day treats coming soon!
                </div>
              </div>

              {submitStatus === 'success' ? (
                <div className="bg-green-50 border-2 border-green-600 rounded-lg p-4 flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className={`text-green-900 ${gabrielaClassName}`}>
                    <strong>You're on the list!</strong> We'll email you when this drop goes live.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={isSubmitting}
                      className={`w-full h-full px-4 py-3 rounded-full border-2 border-amber-700 focus:border-amber-900 focus:outline-none bg-white text-amber-900 placeholder-amber-600 ${gabrielaClassName} disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-900 hover:to-amber-800 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${gabrielaClassName} whitespace-nowrap`}
                  >
                    {isSubmitting ? 'Saving...' : 'Notify Me'}
                  </button>
                </form>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border-2 border-red-700 rounded-lg p-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className={`text-red-900 text-sm ${gabrielaClassName}`}>
                    Something went wrong. Please try again.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <a
      href={dropHref}
      className={`block w-full bg-white rounded-2xl shadow-md border-2 ${drop.borderColor} overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer`}
    >
      <div className="flex flex-col md:flex-row gap-4 p-5">
        {/* Media carousel */}
        <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {currentMedia?.type === 'video' ? (
            <video
              ref={videoRef}
              src={currentMedia.src}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                openLightbox();
              }}
              muted
              loop
              playsInline
              autoPlay
            />
          ) : (
            <Image
              src={currentMedia?.src || ''}
              alt={drop.name}
              fill
              className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                openLightbox();
              }}
              sizes="(max-width: 768px) 100vw, 192px"
            />
          )}

          {drop.media.length > 1 && (
            <>
              {/* Navigation arrows */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  prevMedia();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Previous media"
              >
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  nextMedia();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Next media"
              >
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Media indicator dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {drop.media.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentMediaIndex ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-3 justify-between">
          <div className="flex flex-col gap-3">
            <div>
              <div className={`text-4xl font-bold text-amber-900 ${tangerineClassName}`}>
                {drop.name}
              </div>
              <div className={`text-md text-amber-700 ${gabrielaClassName}`}>
                {drop.flavor}
              </div>
            </div>

            <div className={`flex gap-6 text-amber-800 ${gabrielaClassName}`}>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-sm">Order by:</span>
                  <span className="font-bold text-base">{drop.dropCloses}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-sm">Pickup:</span>
                  <span className="font-bold text-base">{drop.pickupDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-right">
            <span
              className={`inline-block bg-gradient-to-r from-amber-800 to-amber-700 text-white font-semibold py-2 px-6 rounded-full shadow-md group-hover:shadow-lg transition-all duration-200 ${gabrielaClassName}`}
            >
              Shop This Drop →
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-200 hover:scale-110 z-10"
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Media container - prevent clicks from closing */}
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {currentMedia?.type === 'video' ? (
              <video
                ref={lightboxVideoRef}
                src={currentMedia.src}
                className="w-full h-full object-contain rounded-lg"
                muted
                loop
                playsInline
                autoPlay
              />
            ) : (
              <Image
                src={currentMedia?.src || ''}
                alt={drop.name}
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            )}

            {drop.media.length > 1 && (
              <>
                {/* Navigation arrows */}
                <button
                  onClick={prevMedia}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-2xl transition-all duration-200 hover:scale-110"
                  aria-label="Previous media"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextMedia}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-2xl transition-all duration-200 hover:scale-110"
                  aria-label="Next media"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Media indicator dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {drop.media.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentMediaIndex(index)}
                      className={`h-3 rounded-full transition-all ${
                        index === currentMediaIndex ? 'bg-white w-8' : 'bg-white/50 w-3 hover:bg-white/70'
                      }`}
                      aria-label={`Go to media ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </a>
  );
}
