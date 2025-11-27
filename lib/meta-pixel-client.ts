'use client';

import type { MetaEventName, MetaCustomData, ClientTrackingParams } from './meta-types';

declare global {
  interface Window {
    fbq?: (
      action: 'track' | 'trackCustom' | 'init',
      eventName: string,
      params?: Record<string, unknown>,
      options?: { eventID: string }
    ) => void;
  }
}

/**
 * Generate a unique event ID for deduplication
 */
export function generateEventId(): string {
  return crypto.randomUUID();
}

/**
 * Read the Facebook browser ID cookie (_fbp)
 */
export function getFbpCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|;\s*)_fbp=([^;]*)/);
  return match ? match[1] : undefined;
}

/**
 * Read the Facebook click ID cookie (_fbc)
 */
export function getFbcCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|;\s*)_fbc=([^;]*)/);
  return match ? match[1] : undefined;
}

/**
 * Get all tracking params for API requests
 */
export function getTrackingParams(eventId?: string): ClientTrackingParams {
  return {
    event_id: eventId || generateEventId(),
    fbp: getFbpCookie(),
    fbc: getFbcCookie(),
  };
}

/**
 * Fire a browser pixel event with event_id for deduplication
 */
export function trackPixelEvent(
  eventName: MetaEventName,
  eventId: string,
  customData?: MetaCustomData
): void {
  if (typeof window === 'undefined' || !window.fbq) {
    console.warn('Meta Pixel: fbq not available');
    return;
  }

  try {
    console.log(`🔵 [Meta Pixel] ${eventName}`, { eventId, customData });
    window.fbq('track', eventName, (customData || {}) as Record<string, unknown>, { eventID: eventId });
  } catch (error) {
    console.error('Meta Pixel tracking error:', error);
  }
}

/**
 * Track Subscribe event (browser-side)
 */
export function trackSubscribePixel(eventId: string): void {
  trackPixelEvent('Subscribe', eventId);
}

/**
 * Track ViewContent event (browser-side)
 */
export function trackViewContentPixel(
  eventId: string,
  customData?: {
    content_name?: string;
    content_ids?: string[];
    content_type?: string;
    value?: number;
    currency?: string;
  }
): void {
  trackPixelEvent('ViewContent', eventId, customData);
}

/**
 * Track AddToCart event (browser-side)
 */
export function trackAddToCartPixel(
  eventId: string,
  customData: {
    content_name: string;
    content_ids: string[];
    content_type?: string;
    value: number;
    currency: string;
    num_items?: number;
  }
): void {
  trackPixelEvent('AddToCart', eventId, {
    ...customData,
    content_type: customData.content_type || 'product',
  });
}

/**
 * Track InitiateCheckout event (browser-side)
 */
export function trackInitiateCheckoutPixel(
  eventId: string,
  customData?: {
    value?: number;
    currency?: string;
    num_items?: number;
    content_ids?: string[];
  }
): void {
  trackPixelEvent('InitiateCheckout', eventId, customData);
}

/**
 * Track AddPaymentInfo event (browser-side)
 */
export function trackAddPaymentInfoPixel(
  eventId: string,
  customData?: {
    value?: number;
    currency?: string;
    content_ids?: string[];
  }
): void {
  trackPixelEvent('AddPaymentInfo', eventId, customData);
}

/**
 * Track Purchase event (browser-side)
 */
export function trackPurchasePixel(
  eventId: string,
  customData: {
    value: number;
    currency: string;
    content_ids?: string[];
    content_type?: string;
    num_items?: number;
    order_id?: string;
  }
): void {
  trackPixelEvent('Purchase', eventId, {
    ...customData,
    content_type: customData.content_type || 'product',
  });
}
