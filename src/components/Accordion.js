/**
 * Custom Styled Accordion Components
 * 
 * This file provides customized Material-UI Accordion components used throughout the app.
 * The styling creates a cleaner, more compact appearance compared to the default MUI accordions.
 * 
 * These components are primarily used in the Item Generator page to organize
 * the properties of multiple items in a collapsible interface.
 */

import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

/**
 * Custom Accordion Component
 * 
 * Removes default elevation shadow and rounded corners for a flatter appearance.
 * Each accordion has a border instead of shadow for visual separation.
 */
export const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  // Add border for visual separation between accordions
  border: `1px solid ${theme.palette.divider}`,
  
  // Remove bottom border except for last accordion to avoid double borders
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  
  // Remove the default shadow/border that appears before expanded accordion
  '&:before': {
    display: 'none',
  },
}));

/**
 * Custom Accordion Summary (Header) Component
 * 
 * Displays the accordion title and expand/collapse icon.
 * The expand icon is positioned on the left and rotates 90° when expanded.
 */
export const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  // Subtle background color for the header
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'  // Slightly lighter in dark mode
      : 'rgba(0, 0, 0, .03)',        // Slightly darker in light mode
  
  // Move expand icon to the left side instead of right
  flexDirection: 'row-reverse',
  
  // Rotate the arrow icon 90 degrees when accordion is expanded
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  
  // Add spacing between icon and content
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

/**
 * Custom Accordion Details (Content) Component
 * 
 * Contains the expanded content of the accordion.
 * Adds padding and a top border to separate from the summary.
 */
export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),                          // Add padding around content
  borderTop: '1px solid rgba(0, 0, 0, .125)',        // Separator line from header
}));
