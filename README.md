# Plotty

A mobile-first digital publishing and reading platform for independent authors and readers.

## Overview

Plotty enables authors to publish books and sell them directly to readers, providing a better experience than simply distributing PDF files through external platforms.

### For Authors
Write → Publish → Sell → Earn royalties

### For Readers
Discover → Buy → Read

## Technology Stack

- **Mobile**: React Native, Expo, TypeScript
- **Backend**: Supabase, PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Styling**: NativeWind / TailwindCSS

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- A Supabase project account

## Installation

1. **Navigate to the app directory**:
   ```bash
   cd app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Configure your Supabase credentials** in `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Supabase Setup

1. **Create a new project** at [supabase.com](https://supabase.com)

2. **Run the SQL setup** in your Supabase SQL editor to create the required tables:
   - `profiles`
   - `books`
   - `chapters`
   - `purchases`
   - `author_earnings`
   - `payouts`
   - `reading_progress`
   - `bookmarks`

3. **Configure Row Level Security (RLS)** policies to protect user data and paid content

4. **Copy your project URL and anon key** from Supabase settings to your `.env` file

## Development Commands

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web

# Type checking
npm run tsc
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/         # Screen components
├── navigation/      # Navigation configuration
├── features/        # Feature-specific modules
│   ├── auth/       # Authentication
│   ├── books/      # Book management
│   ├── reader/     # Reading experience
│   ├── library/    # User library
│   ├── purchases/  # Purchase flow
│   ├── author/     # Author dashboard
│   └── earnings/   # Author earnings
├── services/       # External service integrations
│   ├── supabase/   # Supabase client
│   └── payments/   # Payment provider
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── constants/      # App constants and theme
```

## Development Phases

### Phase 1 — Project Foundation ✅
- Expo app setup
- TypeScript configuration
- Navigation structure
- Supabase client
- Environment variables
- Basic design system
- Authentication screens
- Profile creation

### Phase 2 — Author Publishing (Next)
- Author profile management
- Book creation and editing
- Cover upload
- Chapter management
- Draft and publish states

### Phase 3 — Reader Discovery
- Home screen
- Search functionality
- Book details
- Author profiles
- Genre browsing

### Phase 4 — Reader/Library
- User library
- Owned books
- Reading screen
- Chapter navigation
- Reading progress
- Bookmarks

### Phase 5 — Commerce
- Purchase architecture
- Payment provider integration
- Server-side verification
- Purchase records
- Ownership/access control

### Phase 6 — Royalties
- Royalty calculation
- Author earnings dashboard
- Earnings history
- Payout provider integration

### Phase 7 — Security & Polish
- RLS audit
- Storage policies
- Paid content access
- Payment verification
- Authorization checks
- UI improvements

## Testing Authentication

1. Start the app: `npm start`
2. Navigate to the Register screen
3. Create a new account with email and password
4. Verify the profile is created in Supabase
5. Test login with the same credentials

## Important Notes

- **Security**: Never commit `.env` files or secrets to git
- **Database**: All financial operations must be server-side verified
- **Content Access**: Paid content is protected through RLS, not just UI
- **MVP Focus**: V1 prioritizes core marketplace functionality over advanced features

## Roadmap

See [PLOTTY-V1.md](./PLOTTY-V1.md) for detailed product specifications and development roadmap.

## License

Proprietary - All rights reserved