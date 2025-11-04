/**
 * Global Snackbar Component
 * 
 * This component renders the actual snackbar (toast notification) that appears on screen.
 * It uses Material-UI's Snackbar and Alert components to display temporary messages.
 * 
 * The snackbar appears in the top-left corner and automatically dismisses after 6 seconds.
 * Users can also manually dismiss it by clicking the close button or clicking outside.
 * 
 * Reference: https://maku.blog/p/jbv7gox/
 */

import * as React from 'react'
import { Snackbar } from '@mui/material'
import MuiAlert from '@mui/material/Alert'

/**
 * Custom Alert Component
 * 
 * Wraps Material-UI Alert with custom styling for use inside the Snackbar.
 * Uses 'filled' variant for a solid colored background and adds elevation shadow.
 */
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert 
    elevation={6}              // Add shadow depth for visibility
    ref={ref} 
    variant="filled"           // Solid colored background
    {...props} 
    sx={{ width: '100%' }}    // Full width within snackbar
  />
})

/**
 * GlobalSnackbar Component
 * 
 * Displays notification messages to the user with different severity levels.
 * The snackbar appears temporarily and automatically hides after 6 seconds.
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the snackbar is visible
 * @param {string} props.message - The message text to display
 * @param {string} props.severity - Message type: 'error', 'warning', 'info', or 'success'
 * @param {Function} props.onClose - Callback function when snackbar closes
 * 
 * @returns {JSX.Element} Snackbar with styled alert
 */
export const GlobalSnackbar = ({
  open,                       // Controls visibility
  message,                    // Notification text
  severity = 'info',          // Default to info type
  onClose                     // Close handler
}) => {
  return (
    <Snackbar 
      open={open} 
      onClose={onClose} 
      autoHideDuration={6000}                          // Auto-close after 6 seconds
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}  // Position in top-left
    >
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  )
}
