/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback, useRef } from 'react';
import { TikTokPixelConfig, TrackingEventData, CheckoutEventData } from '../types/tiktok-pixel';

export const useTikTokPixel = (config: TikTokPixelConfig) => {
  const isInitialized = useRef(false);
  const scriptLoaded = useRef(false);
  const { pixelId } = config;

  // Initialize TikTok Pixel script programmatically
  const initializeTikTokPixel = useCallback(() => {
    if (typeof window === 'undefined' || scriptLoaded.current) return;

    try {
      // TikTok Pixel initialization script (programmatic version)
      (function (w: any, _d: Document, t: string) {
        w.TiktokAnalyticsObject = t;
        const ttq = w[t] = w[t] || [];
        ttq.methods = [
          "page", "track", "identify", "instances", "debug", "on", "off", 
          "once", "ready", "alias", "group", "enableCookie", "disableCookie", 
          "holdConsent", "revokeConsent", "grantConsent"
        ];
        
        ttq.setAndDefer = function(t: any, e: string) {
          t[e] = function() {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        };
        
        for (let i = 0; i < ttq.methods.length; i++) {
          ttq.setAndDefer(ttq, ttq.methods[i]);
        }
        
        ttq.instance = function(t: string) {
          const e = ttq._i[t] || [];
          for (let n = 0; n < ttq.methods.length; n++) {
            ttq.setAndDefer(e, ttq.methods[n]);
          }
          return e;
        };
        
        ttq.load = function(e: string, n?: any) {
          const r = "https://analytics.tiktok.com/i18n/pixel/events.js";
          ttq._i = ttq._i || {};
          ttq._i[e] = [];
          ttq._i[e]._u = r;
          ttq._t = ttq._t || {};
          ttq._t[e] = +new Date();
          ttq._o = ttq._o || {};
          ttq._o[e] = n || {};
          
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.async = true;
          script.src = r + "?sdkid=" + e + "&lib=" + t;
          
          const firstScript = document.getElementsByTagName("script")[0];
          if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(script, firstScript);
          }
        };
      })(window, document, 'ttq');

      scriptLoaded.current = true;
      console.log('✅ TikTok Pixel script loaded programmatically');
    } catch (error) {
      console.error('❌ Error loading TikTok Pixel script:', error);
    }
  }, []);

  // Initialize pixel with configuration
  useEffect(() => {
    if (!pixelId || isInitialized.current) return;

    const setupPixel = async () => {
      try {
        // Initialize script if not loaded
        if (!scriptLoaded.current) {
          initializeTikTokPixel();
        }

        // Wait for ttq to be available with retry logic
        const waitForTTQ = (retries = 50): Promise<void> => {
          return new Promise((resolve, reject) => {
            if (window.ttq && typeof window.ttq.load === 'function') {
              resolve();
            } else if (retries > 0) {
              setTimeout(() => {
                waitForTTQ(retries - 1).then(resolve).catch(reject);
              }, 100);
            } else {
              reject(new Error('TikTok Pixel failed to load after retries'));
            }
          });
        };

        await waitForTTQ();

        // Load pixel with your ID
        window.ttq.load(pixelId, config.testMode ? { debug: true } : undefined);
        
        // Send initial page view
        window.ttq.page();
        
        isInitialized.current = true;
        
        console.log(`✅ TikTok Pixel initialized successfully with ID: ${pixelId}`);
        
        if (config.testMode) {
          console.log('🧪 TikTok Pixel running in test mode');
        }
      } catch (error) {
        console.error('❌ Error initializing TikTok Pixel:', error);
      }
    };

    setupPixel();
  }, [pixelId, config.testMode, initializeTikTokPixel]);

  // Function to track custom events
  const trackEvent = useCallback((eventName: string, eventData: TrackingEventData) => {
    if (!isInitialized.current || !window.ttq) {
      console.warn('⚠️ TikTok Pixel is not initialized');
      return;
    }

    try {
      // Map data according to TikTok specifications
      const trackingData = {
        content_identifier: eventData.content_identifier, // = item_id
        content_type: eventData.content_type,             // = item_category
        content_name: eventData.content_name,             // = item_name
        content_category: eventData.content_category,     // = item_category2
        value: eventData.value,
        currency: eventData.currency || 'USD',
        contents: eventData.contents
      };

      window.ttq.track(eventName, trackingData);
      
      console.log(`📊 TikTok Pixel event sent: ${eventName}`, trackingData);
    } catch (error) {
      console.error('❌ Error sending TikTok Pixel event:', error);
    }
  }, []);

  // Specific function for checkout/purchase events
  const trackPurchase = useCallback((checkoutData: CheckoutEventData) => {
    const purchaseEventData: TrackingEventData = {
      content_identifier: checkoutData.content_identifier,
      content_type: checkoutData.content_type,
      content_name: checkoutData.content_name,
      content_category: checkoutData.content_category,
      value: checkoutData.total_amount,
      currency: checkoutData.currency || 'USD',
      contents: checkoutData.contents
    };

    trackEvent('CompletePayment', purchaseEventData);
  }, [trackEvent]);

  // Function to track add to cart events
  const trackAddToCart = useCallback((productData: TrackingEventData) => {
    trackEvent('AddToCart', productData);
  }, [trackEvent]);

  // Function to track initiate checkout events
  const trackInitiateCheckout = useCallback((checkoutData: TrackingEventData) => {
    trackEvent('InitiateCheckout', checkoutData);
  }, [trackEvent]);

  return {
    trackEvent,
    trackPurchase,
    trackAddToCart,
    trackInitiateCheckout,
    isInitialized: isInitialized.current
  };
};