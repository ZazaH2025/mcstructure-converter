/**
 * Header Component with Navigation Drawer
 * 
 * This component provides the app's main navigation bar with a hamburger menu.
 * It displays the current page title and provides access to other pages through
 * a slide-out drawer menu.
 * 
 * Features:
 * - Fixed app bar that stays at the top while scrolling
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
  width: "18rem",              // Drawer width
  fontSize: "1.2rem",          // Font size for menu items
  backgroundColor: "#fff",     // White background
};

// Styling for the currently active page in menu
const currentPageStyle = {
  backgroundColor: "#ccc",     // Gray background to highlight current page
};

/**
 * Available pages in the application
 * Each page has a URL, title, and unique ID
 */
const pages = [
  { href: "./", title: "mcstructure converter", id: "converter" },
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
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <CloseIcon />
      </IconButton>
      
      {/* Menu title */}
      <div
        style={{
          paddingTop: "1rem",
          paddingLeft: "1rem",
          fontSize: "1.8rem",
          fontWeight: "bold",
        }}
      >
        Apps
      </div>
      
      {/* Navigation links */}
      <nav className="menu">
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
 * Main navigation bar at the top of every page.
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
      <Box sx={{ flexGrow: 1, marginBottom: "5rem" }}>
        {/* Fixed app bar at the top */}
        <AppBar position="fixed" style={{ backgroundColor: "#2a2a2a" }}>
          <Toolbar>
            {/* Hamburger menu button */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Page title */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {name}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Slide-out drawer menu from the left */}
        <Drawer
          anchor={"left"}                    // Drawer slides from left side
          open={menuOpened}                  // Controlled by state
          onClose={handleClick}              // Close when clicking outside
          PaperProps={{ style: menuStyle }}  // Apply custom styling
        >
          <Menu onClose={handleClick} pageId={pageId} />
        </Drawer>
        
      </Box>
    </header>
    
  );
}
