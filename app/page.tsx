'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 overflow-hidden flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      <div className="relative z-10 text-center px-6">
        {/* Oven Animation Container */}
        <div className="relative inline-block mb-12">
          {/* Oven body (open, without door) */}
          <Image
            src="/Oven_Open.svg"
            alt="Oven"
            width={400}
            height={400}
            className="mx-auto"
            priority
          />

          {/* Oven Door - positioned to align with oven */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateX(-3.5px) translateY(12px)' }}>
            <Image
              src="/Oven_Door.svg"
              alt="Oven Door"
              width={400}
              height={400}
              className="mx-auto"
              priority
            />
          </div>
        </div>

        {/* Coming Soon Text */}
        <div className="mt-12 space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
            All the Much Bake Shop
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Something sweet is in the oven! Our new website is baking to perfection and will be ready soon.
          </p>
        </div>
      </div>
    </div>
  );
}
