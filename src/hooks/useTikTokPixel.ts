/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback, useRef } from 'react';
import { TikTokPixelConfig, TrackingEventData, CheckoutEventData } from '../types/tiktok-pixel';

export const useTikTokPixel = (config: TikTokPixelConfig) => {
  const isInitialized = useRef(false);
  const scriptLoaded = useRef(false);
  const { pixelId } = config;

  // Initialize TikTok Pixel with official script (includes direct ttq.load call)
  const initializeTikTokPixel = useCallback(() => {
    if (typeof window === 'undefined' || scriptLoaded.current) return;

    try {
      // Official TikTok Pixel Code - Pure JavaScript implementation
      (function (w, d, t) {
        w.TiktokAnalyticsObject = t;
        var ttq = w[t] = w[t] || [];
        ttq.methods = [
          "page", "track", "identify", "instances", "debug", "on", "off",
          "once", "ready", "alias", "group", "enableCookie", "disableCookie",
          "holdConsent", "revokeConsent", "grantConsent"
        ];
        
        ttq.setAndDefer = function (t, e) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        };
        
        for (var i = 0; i < ttq.methods.length; i++) {
          ttq.setAndDefer(ttq, ttq.methods[i]);
        }
        
        ttq.instance = function (t) {
          for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) {
            ttq.setAndDefer(e, ttq.methods[n]);
          }
          return e;
        };
        
        ttq.load = function (e, n) {
          var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
          var o = n && n.partner;
          ttq._i = ttq._i || {};
          ttq._i[e] = [];
          ttq._i[e]._u = r;
          ttq._t = ttq._t || {};
          ttq._t[e] = +new Date();
          ttq._o = ttq._o || {};
          ttq._o[e] = n || {};
          
          var script = document.createElement("script");
          script.type = "text/javascript";
          script.async = true;
          script.src = r + "?sdkid=" + e + "&lib=" + t;
          
          var firstScript = document.getElementsByTagName("script")[0];
          if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(script, firstScript);
          }
        };

        // Direct load call with pixel ID (as per official code)
        ttq.load(pixelId, config.testMode ? { debug: true } : undefined);
        ttq.page();
        
      })(window, document, 'ttq');

      scriptLoaded.current = true;
      isInitialized.current = true;
      
      console.log(`✅ TikTok Pixel initialized with official script. ID: ${pixelId}`);
      
      if (config.testMode) {
        console.log('🧪 TikTok Pixel running in test mode');
      }
      
    } catch (error) {
      console.error('❌ Error loading TikTok Pixel script:', error);
    }
  }, [pixelId, config.testMode]);

  // Initialize pixel on component mount
  useEffect(() => {
    if (!pixelId || isInitialized.current) return;

    initializeTikTokPixel();
  }, [pixelId, initializeTikTokPixel]);

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

  // Function to manually trigger page view (useful for SPA navigation)
  const trackPageView = useCallback(() => {
    if (!isInitialized.current || !window.ttq) {
      console.warn('⚠️ TikTok Pixel is not initialized');
      return;
    }

    try {
      window.ttq.page();
      console.log('📄 TikTok Pixel page view tracked');
    } catch (error) {
      console.error('❌ Error tracking page view:', error);
    }
  }, []);

  return {
    trackEvent,
    trackPurchase,
    trackAddToCart,
    trackInitiateCheckout,
    trackPageView,
    isInitialized: isInitialized.current
  };
};