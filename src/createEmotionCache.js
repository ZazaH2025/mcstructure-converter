/**
 * Emotion Cache Factory
 * 
 * Creates a cache for Emotion (CSS-in-JS library used by Material-UI).
 * This cache improves performance by caching styled component CSS.
 * 
 * The 'prepend: true' option ensures MUI styles are loaded first,
 * allowing custom styles to override them more easily.
 */

import createCache from '@emotion/cache';

/**
 * Creates and returns an Emotion cache instance for client-side styling
 * 
 * @returns {EmotionCache} Cache instance for Emotion styled components
 */
export default function createEmotionCache() {
    return createCache({ 
      key: 'css',      // Prefix for generated CSS class names
      prepend: true    // Insert styles at the beginning of <head> to allow easy overriding
    });
}
