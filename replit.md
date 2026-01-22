# IPO Analyzer

## Overview

IPO Analyzer is a full-stack web application for tracking and analyzing Initial Public Offerings (IPOs) in the Indian market. Users can browse upcoming, open, and closed IPOs, add them to a personal watchlist, and view detailed information about each offering. The platform provides institutional-grade IPO data with a modern, professional UI designed for retail investors.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with HMR support

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in shared route contracts (`shared/routes.ts`)
- **Validation**: Zod schemas for request/response validation
- **Session Management**: Express sessions with PostgreSQL store

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for database models
- **Migrations**: Drizzle Kit for schema push (`npm run db:push`)

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Session Storage**: PostgreSQL-backed sessions via `connect-pg-simple`
- **User Management**: Automatic user upsert on login with profile sync

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Route page components
│   └── lib/             # Utilities and query client
├── server/              # Express backend
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Database operations
│   └── replit_integrations/auth/  # Auth module
├── shared/              # Shared types and schemas
│   ├── schema.ts        # Drizzle table definitions
│   ├── routes.ts        # API contract definitions
│   └── models/          # Domain models
└── migrations/          # Database migrations
```

### Key Design Patterns
- **Shared Types**: Database schemas and API contracts are defined in `shared/` and imported by both frontend and backend
- **Type-Safe API**: Zod schemas validate inputs and parse responses on both sides
- **Component Library**: shadcn/ui provides accessible, customizable primitives
- **Protected Routes**: Frontend `PrivateRoute` wrapper checks auth state before rendering

## External Dependencies

### Database
- **PostgreSQL**: Primary data store (connection via `DATABASE_URL` environment variable)
- **Tables**: `users`, `sessions`, `ipos`, `watchlist`

### Authentication
- **Replit Auth**: OpenID Connect provider (`ISSUER_URL`, `REPL_ID` environment variables)
- **Session Secret**: Required via `SESSION_SECRET` environment variable

### Third-Party Libraries
- **UI Components**: Radix UI primitives (dialog, dropdown, select, etc.)
- **Date Handling**: date-fns for formatting
- **HTTP Client**: Native fetch with TanStack Query wrappers

### Development Tools
- **Vite Plugins**: Replit-specific plugins for dev experience (cartographer, dev-banner, error overlay)
- **Build**: esbuild for server bundling, Vite for client

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret for session encryption
- `REPL_ID` - Replit environment identifier (auto-set on Replit)
- `ISSUER_URL` - OpenID Connect issuer (defaults to Replit's OIDC)