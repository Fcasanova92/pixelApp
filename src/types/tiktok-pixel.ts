// TikTok Pixel Configuration Interface
export interface TikTokPixelConfig {
  pixelId: string;
  testMode?: boolean;
  debug?: boolean;
}

// Product Item Interface for e-commerce tracking
export interface ProductItem {
  item_id: string;
  item_name: string;
  item_category: string;
  item_category2?: string;
  price: number;
  quantity: number;
  content_id?: string;
  content_type?: string;
  content_name?: string;
}

// Base tracking event data structure
export interface TrackingEventData {
  content_identifier?: string | number;  // = item_id
  content_type?: string;                 // = item_category
  content_name?: string;                 // = item_name
  content_category?: string;             // = item_category2
  value?: number;
  currency?: string;
  contents?: Array<{
    content_id?: string;
    content_type?: string;
    content_name?: string;
    quantity?: number;
    price?: number;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow additional properties for TikTok flexibility
}

// Checkout/Purchase specific event data
export interface CheckoutEventData extends TrackingEventData {
  total_amount: number;
  order_id?: string;
  transaction_id?: string;
  payment_method?: string;
  shipping_cost?: number;
  tax?: number;
}

// Type for callback functions used by TikTok Pixel
type TikTokCallback = (() => void) | ((data?: unknown) => void);

// TikTok Pixel Window Interface (for global ttq object)
declare global {
  interface Window {
    ttq?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      load: (pixelId: string, config?: Record<string, any>) => void;
      page: () => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      track: (eventName: string, eventData?: Record<string, any>) => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      identify: (userData?: Record<string, any>) => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      instances: (pixelId: string) => any;
      debug: (enable?: boolean) => void;
      on: (event: string, callback: TikTokCallback) => void;
      off: (event: string, callback?: TikTokCallback) => void;
      once: (event: string, callback: TikTokCallback) => void;
      ready: (callback: TikTokCallback) => void;
      alias: (userId: string) => void;
      group: (groupId: string) => void;
      enableCookie: () => void;
      disableCookie: () => void;
      holdConsent: () => void;
      revokeConsent: () => void;
      grantConsent: () => void;
      // Internal TikTok properties - using Record for better type safety
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _i?: Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _t?: Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _o?: Record<string, any>;
      methods?: string[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAndDefer?: (obj: Record<string, any>, method: string) => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      instance?: (pixelId: string) => any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any; // Allow additional properties for TikTok internal methods
    };
    TiktokAnalyticsObject?: string;
  }
}

export {};