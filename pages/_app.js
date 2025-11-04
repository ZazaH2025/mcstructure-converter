/**
 * Next.js Custom App Component
 * 
 * This is the main application wrapper that initializes every page in the app.
 * It handles:
 * - Material-UI theme provider and styling setup
 * - Emotion cache for CSS-in-JS performance optimization
 * - Global snackbar notification system
 * - Google Analytics tracking for page views
 * 
 * This file runs on every page load and wraps all page components.
 */

import '../styles/globals.css'
import Head from 'next/head';
import { useEffect } from "react";

// Material-UI theme and styling
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';

// Create Emotion cache for client-side styling
const clientSideEmotionCache = createEmotionCache();

// Google Analytics integration
import { GA_TRACKING_ID, pageview } from '../src/lib/gtag';
import { Analytics } from '../src/lib/gtag';

// Global notification system
import { SnackbarContextProvider } from '../src/snackbar/Snackbar';

/**
 * Custom App Component
 * 
 * Wraps all pages with necessary providers and global functionality.
 * Sets up theming, analytics tracking, and notification system.
 * 
 * @param {Object} props
 * @param {React.Component} props.Component - The active page component
 * @param {Object} props.emotionCache - Emotion cache for styling (server-side or client-side)
 * @param {Object} props.pageProps - Props passed to the page component
 * @param {Object} props.router - Next.js router object for navigation tracking
 */
export default function App(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, router } = props;
  
  // Set up Google Analytics page view tracking on route changes
  useEffect(() => {
    // Skip if GA is not configured
    if (!GA_TRACKING_ID) return;
    
    // Track page view when user navigates to a new page
    const handleRouteChange = (url) => {
      pageview(url);
    };
    
    // Subscribe to route change events
    router.events.on("routeChangeComplete", handleRouteChange);
    
    // Cleanup: unsubscribe when component unmounts
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  
  return (
    // Emotion cache provider for optimized CSS-in-JS styling
    <CacheProvider value={emotionCache}>
      <Head>
        {/* Set viewport for responsive design on mobile devices */}
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      
      {/* Load Google Analytics scripts (if configured) */}
      <Analytics/>
      
      {/* Material-UI theme provider for consistent styling */}
      <ThemeProvider theme={theme}>
        {/* CssBaseline provides consistent baseline CSS across browsers */}
        <CssBaseline />
        
        {/* Snackbar provider for global toast notifications */}
        <SnackbarContextProvider>
          {/* Render the current page component */}
          <Component {...pageProps} />
        </SnackbarContextProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
