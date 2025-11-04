/**
 * Google Analytics Integration
 * 
 * This file handles Google Analytics (GA4) tracking for page views and events.
 * Analytics tracking is optional and only enabled if NEXT_PUBLIC_GA_ID is set
 * in the environment variables.
 * 
 * Usage:
 * 1. Set NEXT_PUBLIC_GA_ID environment variable with your GA4 Measurement ID
 * 2. The Analytics component is automatically included in _app.js
 * 3. Page views are tracked automatically on route changes
 */

import Script from 'next/script';

// Google Analytics tracking ID from environment variables
// If not set, analytics will be disabled
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

/**
 * Sends a page view event to Google Analytics
 * 
 * This is called automatically when the user navigates to a new page.
 * It tracks which pages users visit and how they navigate through the site.
 * 
 * @param {string} url - The page URL to track
 */
export const pageview = (url) => {
  // Skip if analytics is not configured
  if (!GA_TRACKING_ID) return;
  
  // Send page view event to Google Analytics
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

/**
 * Analytics Component
 * 
 * Loads and initializes Google Analytics scripts.
 * This component should be included once in _app.js.
 * 
 * The scripts are loaded with 'afterInteractive' strategy to avoid
 * blocking the initial page load and improve performance.
 * 
 * @returns {JSX.Element} Script tags for Google Analytics or empty fragment
 */
export function Analytics() {
  return (
    <>
      {GA_TRACKING_ID && (
        <>
          {/* Load Google Analytics library */}
          <Script 
            id="load" 
            defer 
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} 
            strategy="afterInteractive" 
          />
          
          {/* Initialize Google Analytics with configuration */}
          <Script id="ga" defer strategy="afterInteractive">
            {`
              // Initialize dataLayer for Google Analytics
              window.dataLayer = window.dataLayer || [];
              
              // Helper function to send data to Analytics
              function gtag(){dataLayer.push(arguments);}
              
              // Record the initialization time
              gtag('js', new Date());
              
              // Configure Analytics with the tracking ID
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
              
              console.info('analytics loaded');
            `}
          </Script>
        </>
      )}
    </>
  )
}
