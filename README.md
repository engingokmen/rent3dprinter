# Rent3DPrinter

A Next.js platform for renting 3D printers and getting 3D models printed.

## Features

- Browse available 3D printers
- List your own 3D printer for rent
- Upload 3D model files and request prints
- Order management and approval workflow
- Dashboard for managing printers and orders

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Authentication**: NextAuth.js (Auth.js v5)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and set:
- `NEXTAUTH_SECRET` - Generate a random secret (you can use: `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Set to `http://localhost:3000` for development

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js App Router pages
- `components/` - React components
- `lib/` - Utilities, mock data, and state management
- `public/` - Static assets

## Current Status

- ✅ Phase 1: UI and structure with mock data
- ✅ Phase 2: Authentication with NextAuth.js (email/password)
- ⏳ Phase 3: Database integration (PostgreSQL)
- ⏳ Phase 4: Payment integration (Stripe)

## Authentication

The app now includes authentication with NextAuth.js:
- User registration and login
- Protected routes (dashboard)
- Session management
- User profile in navbar

**Note**: User data is currently stored in memory (mock storage). This will be replaced with a database in Phase 3.
