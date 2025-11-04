/**
 * Snackbar Context Provider
 * 
 * This file implements a global snackbar (toast notification) system using React Context.
 * It allows any component in the app to trigger notifications without prop drilling.
 * 
 * The snackbar displays temporary messages to the user (success, error, warning, info)
 * and automatically disappears after a few seconds.
 * 
 * Usage in components:
 *   const { showSnackbar } = useSnackbar();
 *   showSnackbar('Operation successful!', 'success');
 * 
 * Reference: https://maku.blog/p/jbv7gox/
 */

import * as React from 'react';
import { GlobalSnackbar } from './GlobalSnackbar';

/**
 * Context object that stores snackbar state and control function
 * 
 * Provides:
 * - message: Current notification message text
 * - severity: Message type ('error', 'warning', 'info', 'success')
 * - showSnackbar: Function to display a new notification
 */
export const SnackbarContext = React.createContext({
  message: '',              // Default: no message shown
  severity: 'error',        // Default severity
  showSnackbar: (_message, _severity) => {},  // Placeholder function
})

/**
 * SnackbarContext Provider Component
 * 
 * Wraps the application to provide snackbar functionality to all child components.
 * This component manages the snackbar state and renders the GlobalSnackbar component.
 * 
 * Should be placed high in the component tree (typically in _app.js) so that
 * all pages and components can access the snackbar functionality.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that can use the snackbar
 */
export const SnackbarContextProvider = ({ children }) => {
  const context = React.useContext(SnackbarContext);
  const [message, setMessage] = React.useState(context.message);
  const [severity, setSeverity] = React.useState(context.severity);

  // Create the context value object with current state and update function
  // useMemo prevents unnecessary re-renders of consuming components
  const newContext = React.useMemo(
    () => ({
      message,
      severity,
      /**
       * Function to display a snackbar notification
       * 
       * @param {string} message - Text to display in the notification
       * @param {string} severity - Type of message: 'error', 'warning', 'info', or 'success'
       */
      showSnackbar: (message, severity) => {
        setMessage(message);
        setSeverity(severity);
      },
    }),
    [message, severity, setMessage, setSeverity]
  );

  /**
   * Closes the snackbar by clearing the message
   * Called automatically after the auto-hide duration or when user clicks away
   */
  const handleClose = React.useCallback(() => {
    setMessage('');
  }, [setMessage]);

  return (
    <SnackbarContext.Provider value={newContext}>
      {children}
      {/* The actual snackbar component that displays notifications */}
      <GlobalSnackbar
        open={newContext.message !== ''}     // Show when there's a message
        message={newContext.message}
        severity={newContext.severity}
        onClose={handleClose}
      />
    </SnackbarContext.Provider>
  )
}

/**
 * Custom Hook for Using Snackbar
 * 
 * Provides easy access to the snackbar context from any component.
 * 
 * @returns {Object} Context object with showSnackbar function
 * 
 * @example
 * const { showSnackbar } = useSnackbar();
 * showSnackbar('File uploaded successfully!', 'success');
 * showSnackbar('An error occurred', 'error');
 */
export function useSnackbar() {
  return React.useContext(SnackbarContext);
}
