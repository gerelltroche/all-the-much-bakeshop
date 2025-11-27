import { createHash } from 'crypto';
import type {
  MetaServerEvent,
  MetaUserData,
  MetaCustomData,
  MetaConversionResponse,
  ConversionResult,
  ClientTrackingParams,
} from './meta-types';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;
const API_VERSION = 'v21.0';

/**
 * SHA256 hash a value after normalizing
 */
function hashSha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * Normalize and hash email address
 * - Lowercase, trim whitespace
 */
export function normalizeAndHashEmail(email: string): string {
  const normalized = email.toLowerCase().trim();
  return hashSha256(normalized);
}

/**
 * Normalize and hash phone number
 * - Remove all non-digits
 * - Add US country code if 10 digits
 */
export function normalizeAndHashPhone(phone: string): string {
  let normalized = phone.replace(/\D/g, '');
  if (normalized.length === 10) {
    normalized = '1' + normalized;
  }
  return hashSha256(normalized);
}

/**
 * Normalize and hash name
 * - Lowercase, trim, remove non-alphabetic characters
 */
export function normalizeAndHashName(name: string): string {
  const normalized = name.toLowerCase().trim().replace(/[^a-z]/g, '');
  return hashSha256(normalized);
}

/**
 * Split full name into first and last name parts
 */
function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

/**
 * Build user data object with hashed PII
 */
export function buildUserData(params: {
  email?: string;
  phone?: string;
  name?: string;
  ipAddress?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
}): MetaUserData {
  const userData: MetaUserData = {};

  if (params.email) {
    userData.em = normalizeAndHashEmail(params.email);
  }

  if (params.phone) {
    userData.ph = normalizeAndHashPhone(params.phone);
  }

  if (params.name) {
    const { firstName, lastName } = splitName(params.name);
    if (firstName) {
      userData.fn = normalizeAndHashName(firstName);
    }
    if (lastName) {
      userData.ln = normalizeAndHashName(lastName);
    }
  }

  if (params.ipAddress) {
    userData.client_ip_address = params.ipAddress;
  }

  if (params.userAgent) {
    userData.client_user_agent = params.userAgent;
  }

  if (params.fbp) {
    userData.fbp = params.fbp;
  }

  if (params.fbc) {
    userData.fbc = params.fbc;
  }

  return userData;
}

/**
 * Extract client IP from request headers
 */
export function getClientIp(request: Request): string | undefined {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || undefined;
}

/**
 * Extract user agent from request headers
 */
export function getUserAgent(request: Request): string | undefined {
  return request.headers.get('user-agent') || undefined;
}

/**
 * Send event to Meta Conversions API
 */
async function sendConversionEvent(
  event: MetaServerEvent
): Promise<ConversionResult> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('🔴 [Meta CAPI] Missing PIXEL_ID or ACCESS_TOKEN - server event not sent');
    return { success: false, error: 'Missing configuration' };
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

  const body: { data: MetaServerEvent[]; test_event_code?: string } = {
    data: [event],
  };

  if (TEST_EVENT_CODE) {
    body.test_event_code = TEST_EVENT_CODE;
    console.log(`🟡 [Meta CAPI] Using test event code: ${TEST_EVENT_CODE}`);
  }

  console.log(`🟢 [Meta CAPI] Sending ${event.event_name}`, {
    eventId: event.event_id,
    customData: event.custom_data,
    userDataKeys: Object.keys(event.user_data),
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = (await response.json()) as MetaConversionResponse | { error: unknown };

    if (!response.ok) {
      console.error('🔴 [Meta CAPI] Error:', data);
      return { success: false, error: data };
    }

    console.log(`✅ [Meta CAPI] ${event.event_name} sent successfully`, data);
    return { success: true, data: data as MetaConversionResponse };
  } catch (error) {
    console.error('🔴 [Meta CAPI] Exception:', error);
    return { success: false, error };
  }
}

/**
 * Track Subscribe event (newsletter signup, drop notifications)
 */
export async function trackSubscribe(params: {
  eventId: string;
  eventSourceUrl?: string;
  userData: MetaUserData;
}): Promise<ConversionResult> {
  const event: MetaServerEvent = {
    event_name: 'Subscribe',
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    event_source_url: params.eventSourceUrl,
    user_data: params.userData,
    action_source: 'website',
  };

  return sendConversionEvent(event);
}

/**
 * Track ViewContent event (viewing product/drop page)
 */
export async function trackViewContent(params: {
  eventId: string;
  eventSourceUrl?: string;
  userData: MetaUserData;
  customData?: MetaCustomData;
}): Promise<ConversionResult> {
  const event: MetaServerEvent = {
    event_name: 'ViewContent',
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    event_source_url: params.eventSourceUrl,
    user_data: params.userData,
    custom_data: params.customData,
    action_source: 'website',
  };

  return sendConversionEvent(event);
}

/**
 * Track InitiateCheckout event (starting checkout process)
 */
export async function trackInitiateCheckout(params: {
  eventId: string;
  eventSourceUrl?: string;
  userData: MetaUserData;
  customData?: MetaCustomData;
}): Promise<ConversionResult> {
  const event: MetaServerEvent = {
    event_name: 'InitiateCheckout',
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    event_source_url: params.eventSourceUrl,
    user_data: params.userData,
    custom_data: params.customData,
    action_source: 'website',
  };

  return sendConversionEvent(event);
}

/**
 * Track AddPaymentInfo event (entering payment details)
 */
export async function trackAddPaymentInfo(params: {
  eventId: string;
  eventSourceUrl?: string;
  userData: MetaUserData;
  customData?: MetaCustomData;
}): Promise<ConversionResult> {
  const event: MetaServerEvent = {
    event_name: 'AddPaymentInfo',
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    event_source_url: params.eventSourceUrl,
    user_data: params.userData,
    custom_data: params.customData,
    action_source: 'website',
  };

  return sendConversionEvent(event);
}

/**
 * Track Purchase event (completed order)
 */
export async function trackPurchase(params: {
  eventId: string;
  eventSourceUrl?: string;
  userData: MetaUserData;
  customData: MetaCustomData;
}): Promise<ConversionResult> {
  const event: MetaServerEvent = {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    event_source_url: params.eventSourceUrl,
    user_data: params.userData,
    custom_data: params.customData,
    action_source: 'website',
  };

  return sendConversionEvent(event);
}

/**
 * Helper to extract tracking params from request body
 */
export function extractTrackingParams(body: Record<string, unknown>): ClientTrackingParams {
  return {
    event_id: (body.event_id as string) || crypto.randomUUID(),
    fbp: body.fbp as string | undefined,
    fbc: body.fbc as string | undefined,
  };
}
