// TikTok Pixel Types and Interfaces
export interface TikTokPixelConfig {
  pixelId: string;
  testMode?: boolean;
}

export interface ProductItem {
  item_id: string;
  item_name: string;
  item_category: string;
  item_category2: string;
  price: number;
  quantity: number;
}

export interface TrackingEventData {
  content_identifier: string;
  content_type: string;
  content_name: string;
  content_category: string;
  value?: number;
  currency?: string;
  contents?: ProductItem[];
}

export interface CheckoutEventData extends TrackingEventData {
  order_id: string;
  total_amount: number;
}

// TikTok Global Object Type Declaration
declare global {
  interface Window {
    ttq: {
      load: (pixelId: string, options?: unknown) => void;
      page: () => void;
      track: (eventName: string, data: TrackingEventData) => void;
      identify: (data: unknown) => void;
      ready: (callback: () => void) => void;
    };
  }
}

export {};