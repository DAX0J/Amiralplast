# Frankincense Oil Landing Page

## Overview

 
This is a single-page e-commerce application for selling authentic frankincense oil (زيت لبان الذكر) in Algeria. The application features a modern Arabic-language landing page with order form functionality, built as a frontend-only application with React using client-side integrations. The system processes orders through direct Telegram API, Google Sheets OAuth, and Facebook Pixel integration without requiring a backend server. Features a special "Buy 2 Get 1 Free" promotional system with dynamic pricing calculation.

## User Preferences

Preferred communication style: Simple, everyday language.

## Git Configuration
- Commits should use: dax <bouchal2007@gmail.com>
- Updated for Vercel deployment compatibility
- Configuration updated: 2025-08-23

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **UI Framework**: Shadcn/UI components with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with Arabic (RTL) support using Cairo and Tajawal fonts
- **State Management**: React Hook Form with Zod validation for form handling, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Animation**: Framer Motion for smooth transitions and animations

### Netlify Functions Architecture (Updated: 2025-08-26)
- **Backend**: Netlify Functions for secure API integrations
- **Language**: JavaScript/TypeScript with serverless deployment
- **API Integration**: Secure server-side integrations via Netlify Functions
- **Google Sheets**: Direct Google Sheets API integration using Service Account authentication
- **Telegram Integration**: Direct Telegram Bot API integration using Bot Token
- **Security**: All credentials stored as environment variables, no sensitive data in frontend
- **Clean Architecture**: Removed all old webhook-based code and Google Apps Script approaches

### Form Validation & Order Processing
- **Client-side Validation**: Comprehensive validation for Algerian phone numbers, addresses, and order quantities
- **Rate Limiting**: Browser-based fingerprinting and localStorage to prevent spam orders
- **Order Flow**: Form submission → validation → Netlify Functions → Google Sheets API → success confirmation
- **Promotion System**: "Buy 2 Get 1 Free" offer with automatic pricing calculation and visual indicators

### Google Sheets Integration (Clean Implementation: 2025-08-26)
- **Method**: Google Sheets API v4 with Service Account authentication
- **Implementation**: Clean `netlify/functions/append-order.js` using only googleapis official SDK
- **Authentication**: Service Account JSON key stored in environment variables
- **Data Flow**: Frontend → Netlify Function → Google Sheets API → Direct spreadsheet update
- **Spreadsheet ID**: `1C7xX-naJojJ1-TUaUXhWikprdqruuPYVyb7oBugYWXw`
- **Service Account**: `skin-by-miras@sage-facet-470205-m2.iam.gserviceaccount.com`

### Telegram Integration (Clean Implementation: 2025-08-26)
- **Method**: Direct Telegram Bot API integration
- **Implementation**: Clean `netlify/functions/send-telegram.js` using native fetch
- **Authentication**: Bot Token and Chat ID stored in environment variables
- **Data Flow**: Frontend → Netlify Function → Telegram Bot API → Message sent
- **Bot Token**: Configured via TELEGRAM_BOT_TOKEN environment variable
- **Chat ID**: Configured via TELEGRAM_CHAT_ID environment variable

### Responsive Design
- **Mobile-First**: Optimized for mobile devices with touch-friendly interfaces
- **Progressive Loading**: Image lazy loading with loading states
- **Floating CTA**: Context-aware floating call-to-action button

### Internationalization
- **Language**: Fully Arabic interface with RTL support
- **Regional Data**: Comprehensive Algerian wilaya (province) data with delivery pricing
- **Currency**: Algerian Dinar (DZD) pricing structure

## External Dependencies

### Communication Services
- **Telegram Bot API**: For order notifications to business owners
- **Configuration**: Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables

### Analytics & Marketing
- **Facebook Pixel**: For conversion tracking and marketing analytics
- **Configuration**: Uses VITE_FB_PIXEL_ID environment variable
- **Events**: Tracks page views, form interactions, and order completions

### Database Services
- **PostgreSQL**: Primary database (Neon Database serverless)
- **Configuration**: Requires DATABASE_URL environment variable
- **ORM**: Drizzle with migrations support

### Development Tools
- **Replit Integration**: Development environment optimizations
- **Error Handling**: Runtime error overlays and development banners
- **Code Analysis**: Cartographer plugin for code exploration

### Fonts & UI
- **Google Fonts**: Cairo and Tajawal for Arabic typography
- **Icons**: Lucide React for consistent iconography
- **Components**: Extensive Shadcn/UI component library integration

### Build & Deployment
- **Build Tool**: Vite with React plugin and TypeScript support
- **Bundling**: ESBuild for server-side bundling
- **Asset Management**: Static asset serving with protection against right-click/drag operations