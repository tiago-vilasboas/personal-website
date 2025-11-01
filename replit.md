# Overview

This is a professional consulting portfolio website for Tiago Vilas Boas, showcasing strategic consulting services focused on brand governance, content operations, and enterprise adoption programs. The application presents "Signature Offers" including governance blueprints, adoption-as-a-service, M&A brand integration, and executive advisory services. The site is built as a single-page application with smooth scrolling navigation between sections for services, about, case studies, insights, and contact.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing with a simple home/not-found structure
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CSS variables for theming, Inter font family, and responsive design
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation resolvers

## Backend Architecture
- **Server**: Express.js with TypeScript in ESM format
- **API Structure**: RESTful API routes with `/api` prefix, middleware for request logging and error handling
- **Storage Layer**: Abstract storage interface with in-memory implementation for contacts
- **Development**: Hot module replacement via Vite middleware in development mode

## Data Storage
- **Database**: PostgreSQL configured via Drizzle ORM with Neon Database serverless driver
- **Schema**: Contact table with fields for name, email, company, message, and timestamps
- **Migrations**: Drizzle Kit for schema management and migrations
- **Validation**: Zod schemas for type-safe data validation

## Component Architecture
- **Design System**: Comprehensive UI component library with consistent theming
- **Layout**: Single-page application with header navigation, main content sections, and footer
- **Sections**: Modular components for Hero, Signature Offers, About, Case Studies, Insights, and Contact
- **Responsive Design**: Mobile-first approach with collapsible navigation and adaptive layouts

# External Dependencies

## Core Framework Dependencies
- **React**: Frontend framework with hooks and functional components
- **Vite**: Build tool and development server with TypeScript support
- **Express**: Node.js web application framework for API server

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **shadcn/ui**: Pre-built component library with consistent design system
- **Lucide React**: Icon library for consistent iconography

## Data and Forms
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database provider
- **React Hook Form**: Performant forms library with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **TanStack Query**: Server state management with caching and synchronization

## Development Tools
- **TypeScript**: Static type checking for enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Plugins**: Development tooling including error overlays and dev banners