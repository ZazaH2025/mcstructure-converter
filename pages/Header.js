/**
 * Header Component with Navigation Drawer
 * 
 * This component provides the app's main navigation bar with a hamburger menu.
 * Features a modern gradient design with Minecraft-inspired colors.
 * 
 * Features:
 * - Fixed app bar with gradient background
 * - Hamburger menu icon to open navigation drawer
 * - Drawer menu with links to all app pages
 * - Highlights current page in the menu
 */

import React from "react";
import Link from "next/link";

// Material-UI components for the header and drawer
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";

// Icons for menu controls
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

// Styling for the drawer menu
const menuStyle = {
  width: "20rem",
  fontSize: "1.15rem",
  backgroundColor: "#fff",
};

// Styling for the currently active page in menu
const currentPageStyle = {
  backgroundColor: "#e8f5e9",
  borderLeft: "4px solid #4CAF50",
  color: "#4CAF50",
  fontWeight: 600,
};

/**
 * Available pages in the application
 * Each page has a URL, title, and unique ID
 */
const pages = [
  { href: "./", title: "MCStructure Converter", id: "converter" },
  { href: "./items",title: "Item Generator", id: "items" },
];

/**
 * Menu Component
 * 
 * Renders the drawer menu content with navigation links.
 * Highlights the current page and provides a close button.
 * 
 * @param {Object} props
 * @param {Function} props.onClose - Function to close the drawer
 * @param {string} props.pageId - ID of the current page for highlighting
 */
function Menu({ onClose, pageId }) {
  return (
    <>
      {/* Close button in the drawer */}
      <IconButton
        size="large"
        edge="start"
        onClick={onClose}
        aria-label="close"
        style={{ display: "flex", justifyContent: "flex-end", color: "#666" }}
      >
        <CloseIcon />
      </IconButton>
      
      {/* Menu title */}
      <div
        style={{
          paddingTop: "1rem",
          paddingBottom: "1.5rem",
          paddingLeft: "1.5rem",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#333",
          borderBottom: "2px solid #f0f0f0",
        }}
      >
        Minecraft Tools
      </div>
      
      {/* Navigation links */}
      <nav className="menu" style={{ padding: "1rem 0.5rem" }}>
        <ul>
          {/* Map through pages array to create menu items */}
          {...pages.map((p) => (
            <li key={p.id} style={pageId === p.id ? currentPageStyle : null}>
              {/* Next.js Link for client-side navigation */}
              <Link href={p.href}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

/**
 * Header Component
 * 
 * Main navigation bar at the top of every page with gradient background.
 * Contains hamburger menu, page title, and drawer navigation.
 * 
 * @param {Object} props
 * @param {string} props.name - The page title to display in the app bar
 * @param {string} props.pageId - ID of the current page (for highlighting in menu)
 */
export default function Header({ name, pageId }) {
  // State to control whether the drawer is open or closed
  const [menuOpened, setMenuOpened] = React.useState(false);
  
  // Toggle drawer open/closed
  const handleClick = () => setMenuOpened(!menuOpened);

  return (
    <header>
      <Box sx={{ flexGrow: 1, marginBottom: "6rem" }}>
        {/* Fixed app bar at the top with gradient */}
        <AppBar 
          position="fixed" 
          elevation={4}
          sx={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
          }}
        >
          <Toolbar sx={{ minHeight: '70px' }}>
            {/* Hamburger menu button */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ 
                mr: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'rotate(90deg)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Page title with icon */}
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 600,
                letterSpacing: '0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              ⛏️ {name}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Slide-out drawer menu from the left */}
        <Drawer
          anchor={"left"}
          open={menuOpened}
          onClose={handleClick}
          PaperProps={{ 
            style: menuStyle,
            sx: {
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }
          }}
        >
          <Menu onClose={handleClick} pageId={pageId} />
        </Drawer>
        
      </Box>
    </header>
  );
}
