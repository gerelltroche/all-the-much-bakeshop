'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';

export type MediaType = 'image' | 'video';

export interface MediaItemData {
  type: MediaType;
  src: string;
}

interface MediaItemProps {
  media: MediaItemData;
  alt: string;
  isVisible?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function MediaItem({ media, alt, isVisible = true, className = '', onClick }: MediaItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (media.type === 'video' && videoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch(() => {
          // Autoplay may be blocked by browser, that's ok
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isVisible, media.type]);

  if (media.type === 'video') {
    return (
      <video
        ref={videoRef}
        src={media.src}
        className={className}
        onClick={onClick}
        muted
        loop
        playsInline
        autoPlay={isVisible}
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      onClick={onClick}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
}
