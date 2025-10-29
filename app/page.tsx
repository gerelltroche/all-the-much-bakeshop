'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    // Stage 0: Oven hops (0-2s)
    // Stage 1: Oven door opens down (2-2.8s)
    // Stage 2: Logo visible inside with perspective (2.8-3.3s)
    // Stage 3: Logo slides out and grows (3.3-4.5s)
    // Stage 4: Hold (4.5s+)

    const timer1 = setTimeout(() => setAnimationStage(1), 2000);
    const timer2 = setTimeout(() => setAnimationStage(2), 2800);
    const timer3 = setTimeout(() => setAnimationStage(3), 3300);
    const timer4 = setTimeout(() => setAnimationStage(4), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

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
        {/* Animated Oven */}
        <div className={`relative inline-block ${animationStage === 0 ? 'animate-hop' : ''}`}>
          <Image
            src="/Oven.svg"
            alt="Oven"
            width={320}
            height={320}
            className="mx-auto"
            priority
          />

          {/* Logo that slides out and grows */}
          {animationStage >= 3 && (
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                animationStage === 3 ? 'animate-slide-out-grow' : ''
              }`}
              style={{
                top: animationStage === 3 ? '20px' : '-40px',
              }}
            >
              <div className={`relative drop-shadow-2xl ${animationStage === 3 ? 'w-32 h-32' : 'w-56 h-56'}`}
                   style={{
                     transition: animationStage === 3 ? 'width 1.2s ease-out, height 1.2s ease-out' : 'none'
                   }}>
                <Image
                  src="/AllTheMuchBakeshopLogoTransparentBack.png"
                  alt="All the Much Bake Shop Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          )}
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

      {/* Custom animations */}
      <style jsx>{`
        @keyframes hop {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-30px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-15px); }
        }

        @keyframes slideOutGrow {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translateY(-60px) scale(1.4);
            opacity: 1;
          }
        }

        .animate-hop {
          animation: hop 2s ease-in-out;
        }

        .animate-slide-out-grow {
          animation: slideOutGrow 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
