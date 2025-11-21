'use client';

import { useState } from 'react';

interface Drop {
  id: string;
  name: string;
  emoji: string;
  href: string;
  borderColor: string;
  gradient: string;
  images: string[];
  flavor: string;
  orderBy: string;
  pickupDate: string;
  comingSoon: boolean;
}

interface DropCarouselProps {
  drop: Drop;
  gabrielaClassName: string;
  tangerineClassName: string;
}

export function DropCarousel({ drop, gabrielaClassName, tangerineClassName }: DropCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % drop.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + drop.images.length) % drop.images.length);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  if (drop.comingSoon) {
    return (
      <div className={`block w-full bg-gradient-to-r from-blue-100 via-red-100 to-blue-100 rounded-2xl p-5 shadow-md border-2 ${drop.borderColor} relative overflow-hidden opacity-75`}>
        {/* Coming Soon Ribbon */}
        <div className="absolute top-4 -left-10 bg-blue-500 text-white pl-8 pr-12 py-1 -rotate-45 shadow-lg z-10">
          <span className="text-xs font-bold">COMING SOON</span>
        </div>

        <div className="flex items-center justify-between ml-18">
          <div>
            <div className={`text-3xl font-bold text-amber-900 ${tangerineClassName}`}>
              {drop.name}
            </div>
            <div className={`text-sm text-amber-700 ${gabrielaClassName}`}>
              Coming soon
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`block w-full bg-white rounded-2xl shadow-md border-2 ${drop.borderColor} overflow-hidden`}>
      <div className="flex flex-col md:flex-row gap-4 p-5">
        {/* Image carousel */}
        <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={drop.images[currentImageIndex]}
            alt={drop.name}
            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={openLightbox}
          />

          {drop.images.length > 1 && (
            <>
              {/* Navigation arrows */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Next image"
              >
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image indicator dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {drop.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-3">
          <div>
            <div className={`text-3xl font-bold text-amber-900 ${tangerineClassName}`}>
              {drop.name}
            </div>
            <div className={`text-sm text-amber-700 ${gabrielaClassName}`}>
              {drop.flavor}
            </div>
          </div>

          <div className={`flex gap-4 text-xs text-amber-800 ${gabrielaClassName}`}>
            <div>
              <span className="font-semibold">Order By:</span> {drop.orderBy}
            </div>
            <div>
              <span className="font-semibold">Pickup:</span> {drop.pickupDate}
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-2 md:text-left text-right">
            <a
              href={drop.href}
              className={`inline-block bg-gradient-to-r from-rose-400 to-amber-400 hover:from-rose-500 hover:to-amber-500 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${gabrielaClassName}`}
            >
              Shop This Drop →
            </a>
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

          {/* Image container - prevent clicks from closing */}
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={drop.images[currentImageIndex]}
              alt={drop.name}
              className="w-full h-full object-contain rounded-lg"
            />

            {drop.images.length > 1 && (
              <>
                {/* Navigation arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-2xl transition-all duration-200 hover:scale-110"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-2xl transition-all duration-200 hover:scale-110"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image indicator dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {drop.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 w-3 hover:bg-white/70'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
