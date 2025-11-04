# Overview

This is a web application for converting Minecraft Bedrock Edition (.mcstructure) files into editable JSON format and vice versa. The application also includes an item generator tool that creates custom Minecraft items with enchantments. Built with Next.js and Material-UI, it provides a user-friendly interface for Minecraft content creators to manipulate structure files without directly editing NBT (Named Binary Tag) data.

# Recent Changes

**November 4, 2025** - Major visual redesign with Minecraft-inspired theme:
- Implemented Minecraft-inspired color palette (green theme: #2d5016, #4a7c2c, #43a047, #4CAF50)
- Added gradient header with animation effects and pickaxe emoji
- Redesigned both pages with modern card-based layouts
- Enhanced UI components with better spacing, shadows, and rounded corners
- Added smooth transitions and hover effects throughout
- Improved form inputs with focused states and better visual feedback
- Added "Minecraft Bedrock Edition" badges to both pages
- Updated button styling with modern Material-UI design patterns
- Improved responsive design and mobile-first approach

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: Next.js 13 with React 18
- Server-side rendering (SSR) enabled for optimal performance
- Pages-based routing with two main routes:
  - `/` - mcstructure converter tool
  - `/items` - Item generator with chest structures

**UI Framework**: Material-UI (MUI) v5
- Emotion-based styling system for CSS-in-JS
- Custom theme configuration in `src/theme.js`
- Emotion cache for SSR optimization
- Responsive design with mobile-first approach

**State Management**: React hooks (useState, useContext)
- Custom context for global snackbar notifications (`SnackbarContext`)
- Local component state for form data and file handling
- No external state management library (Redux, Zustand, etc.)

## Core Features Architecture

**File Processing**: 
- Drag-and-drop file upload using `react-dropzone`
- NBT (Named Binary Tag) parsing using `prismarine-nbt` library
- SNBT support via `nbt-ts` for structure manipulation
- Binary data handling with Node.js Buffer API in browser

**Data Conversion Flow**:
1. User uploads .mcstructure file (NBT binary format)
2. Parse NBT using `prismarine-nbt` with little-endian format
3. Convert to JSON for editing
4. Reverse process: JSON → NBT → .mcstructure file download
5. Special handling for level.dat files with 8-byte header addition

**Item Generation**:
- Template-based structure creation using `chest_structure.json`
- Programmatic NBT compound creation for items
- Enchantment system with predefined types (37 enchantments mapped)
- Support for custom item attributes (name, lore, damage, count)
- Maximum 27 items per chest (Minecraft inventory limit)

## Component Architecture

**Shared Components**:
- `Header.js` - Navigation with drawer menu
- `GlobalSnackbar.js` - Toast notifications for user feedback
- Custom `Accordion` components wrapping MUI

**Page Components**:
- `index.js` - Main converter interface
- `items.js` - Item generator with accordion-based UI for multiple items

## Analytics Integration

**Google Analytics**: Optional tracking via environment variable
- Page view tracking on route changes
- Event tracking setup in `src/lib/gtag.js`
- Conditional loading based on `NEXT_PUBLIC_GA_ID`

## Build Configuration

**Development**: Runs on port 5000, binds to 0.0.0.0 for network access
**Production**: Next.js static generation with React strict mode enabled
**Linting**: ESLint with Next.js core web vitals config, unused vars warnings disabled

# External Dependencies

## NPM Packages

**Core Framework**:
- `next` (13.5.4) - React framework with SSR
- `react` (18.2.0) - UI library
- `react-dom` (18.2.0) - React DOM renderer

**UI Components**:
- `@mui/material` (^5.11.7) - Component library
- `@mui/icons-material` (^5.11.0) - Icon set
- `@emotion/react` & `@emotion/styled` - CSS-in-JS styling
- `@emotion/server` - SSR support for Emotion

**File & Data Processing**:
- `prismarine-nbt` (^2.2.1) - NBT parsing/writing for Minecraft data
- `nbt-ts` (^1.3.5) - SNBT support and NBT utilities
- `react-dropzone` (^14.2.3) - Drag-and-drop file upload

**Development**:
- `eslint` & `eslint-config-next` - Code linting

## Minecraft-Specific Integration

**NBT Format Handling**:
- Little-endian byte order for Bedrock Edition compatibility
- Structure format version 1 support
- Block indices, palette, and entity data structures
- Special level.dat header format (8-byte prefix with file type and size)

**Enchantment System**:
- Static mapping of 37 enchantment IDs to names
- Based on Bedrock Edition data values specification

## Browser APIs

- Clipboard API for copy functionality
- Blob/File API for file downloads
- FileReader API for file uploads