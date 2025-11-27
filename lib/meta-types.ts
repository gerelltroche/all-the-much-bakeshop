/**
 * Meta Pixel Conversions API Types
 * https://developers.facebook.com/docs/marketing-api/conversions-api/parameters
 */

export type MetaEventName =
  | 'Subscribe'
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'PageView';

export interface MetaUserData {
  /** Hashed email (SHA256, lowercase, trimmed) */
  em?: string;
  /** Hashed phone (SHA256, digits only with country code) */
  ph?: string;
  /** Hashed first name (SHA256, lowercase, a-z only) */
  fn?: string;
  /** Hashed last name (SHA256, lowercase, a-z only) */
  ln?: string;
  /** Client IP address (unhashed) */
  client_ip_address?: string;
  /** Client user agent (unhashed) */
  client_user_agent?: string;
  /** Facebook browser ID cookie (_fbp) */
  fbp?: string;
  /** Facebook click ID cookie (_fbc) */
  fbc?: string;
  /** External ID for cross-platform matching */
  external_id?: string;
}

export interface MetaCustomData {
  /** Monetary value of the event */
  value?: number;
  /** Currency code (e.g., 'USD') */
  currency?: string;
  /** Product IDs involved in the event */
  content_ids?: string[];
  /** Type of content (e.g., 'product') */
  content_type?: string;
  /** Name of the content */
  content_name?: string;
  /** Number of items */
  num_items?: number;
  /** Order ID for Purchase events */
  order_id?: string;
  /** Content category */
  content_category?: string;
  /** Array of content objects with detailed product info */
  contents?: Array<{
    id: string;
    quantity: number;
    item_price?: number;
  }>;
}

export interface MetaServerEvent {
  /** Standard or custom event name */
  event_name: MetaEventName;
  /** Unix timestamp in seconds */
  event_time: number;
  /** Unique event ID for deduplication */
  event_id: string;
  /** URL where the event occurred */
  event_source_url?: string;
  /** User data for matching */
  user_data: MetaUserData;
  /** Custom data specific to the event */
  custom_data?: MetaCustomData;
  /** Action source (always 'website' for web events) */
  action_source: 'website';
  /** Set to true for test events */
  opt_out?: boolean;
}

export interface MetaConversionRequest {
  /** Array of events to send */
  data: MetaServerEvent[];
  /** Test event code (remove in production) */
  test_event_code?: string;
}

export interface MetaConversionResponse {
  /** Number of events received */
  events_received: number;
  /** Array of messages/warnings */
  messages?: string[];
  /** Facebook trace ID for debugging */
  fbtrace_id?: string;
}

export interface ConversionResult {
  success: boolean;
  data?: MetaConversionResponse;
  error?: unknown;
}

/** Parameters passed from client to server for tracking */
export interface ClientTrackingParams {
  event_id: string;
  fbp?: string;
  fbc?: string;
}
