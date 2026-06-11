# CLAUDE.md

## Project Overview
Medicare is a mobile-first healthcare application that provides users with access to their medical information, allows them to find care, and manage their benefits.

## Commands

## Tech Stack
- React Native 0.76+ (New Architecture enabled)
- Navigation: React Navigation v7
- State: Zustand
- Styling: StyleSheet.create() (No inline styles)
- Testing: Detox for E2E, Jest for unit tests
- Authentication: Descope for authentication
- API: Custom API layer using Axios
- TypeScript: Strict TypeScript for type safety
- Turbo for monorepo management

### Root (run from repo root)
```bash
npm run dev          # Start all workspaces in dev mode (Turbo)
npm run build        # Build all workspaces in dependency order
```

### Web (`apps/web`)
```bash
npm run dev --workspace=apps/web      # Vite dev server on :5173
npm run build --workspace=apps/web    # tsc -b + vite build

```

### Mobile (`apps/mobile`)
```bash
npm run dev --workspace=apps/mobile   # expo start -c (clear cache)
npm run ios --workspace=apps/mobile   # iOS simulator
npm run android --workspace=apps/mobile # Android emulator
# Detox E2E requires a prior build:
```

### Mock Server (`packages/mock-server`)
```bash
npm run dev --workspace=packages/mock-server  # ts-node server.ts on :3001
```

## Architecture
1. Create the directory structure:
   src/features/<name>/
   ├── screens/        # Screen components
   ├── components/     # Feature-specific components
   ├── hooks/          # Custom hooks for business logic
   ├── types/          # TypeScript types/interfaces
   ├── services/       # API calls (TanStack Query)
   ├── __tests__/      # Colocated tests
   └── index.ts        # Barrel export
2. Every screen gets an Error Boundary wrapper
3. Every API call goes through a custom hook with TanStack Query
4. Navigation types must extend RootStackParamList
5. Run tsc --noEmit after scaffolding to verify types

### Monorepo Structure
- **`apps/web`** — React 19 + Vite SPA (TailwindCSS, React Router 7, Descope auth SDK)
- **`apps/mobile`** — React Native 0.83 + Expo 55 (iOS/Android, Detox E2E)
- **`packages/shared`** — Shared API layer, types, Zod schemas, React Query hooks
- **`packages/ui`** — Shared React component library
- **`packages/mock-server`** — Express 5 dev API server (port 3001, 300ms simulated latency)
- **`turbo.json`** — Task orchestration; `build` is topologically sorted, `dev` is persistent/uncached

### Shared API Layer (`packages/shared`)
This is the most critical cross-cutting package. Both apps consume it:

- **`services/dashboardService.ts`** — All API fetch logic with Zod validation. Uses a pluggable HTTP client: call `setHttpClient(axiosInstance)` (mobile) or `setBaseUrl(url)` (web) at app startup. Never import Axios directly in web; never call fetch directly in mobile.
- **`hooks/queries.ts`** — 20+ TanStack React Query hooks (`useHero`, `useClaims`, `useProviders`, mutations, etc.). Default: 5min stale time, 24hr cache.
- **`types/index.ts`** — Single source of truth for all TypeScript interfaces.

### Authentication
- **Mobile:** PKCE OAuth2 via Descope + `expo-auth-session`. Tokens stored in `expo-secure-store` via a Zustand persist adapter. Dev bypass active when `EXPO_PUBLIC_DESCOPE_PROJECT_ID` is unset (sets dummy tokens). Token refresh uses a queue to prevent race conditions on 401s.
- **Web:** Descope React SDK wraps the app; `ProtectedRoute` checks auth state. Tokens managed by SDK internally.
- **Auth state (mobile):** `useAuthStore` (Zustand) — `isAuthenticated`, `isHydrated`, tokens, userId, memberName.

### Mobile Navigation
Type-safe navigation using React Navigation with full `RootStackParamList` augmentation. Structure:

```
RootNavigator (auth gate)
├── AuthNavigator → LoginScreen
└── AppNavigator (stack)
    ├── TabNavigator (custom BottomNav)
    │   ├── Dashboard
    │   ├── Claims (nested stack: ClaimsList → ClaimDetail)
    │   ├── FindCare (nested stack: FindCareList → ProviderDetail)
    │   ├── Benefits
    │   └── Prescriptions
    ├── Notifications (modal-style)
    └── Settings (modal-style)
```

Deep link scheme: `aura-wellness://` (configured in `linking.ts`). Path alias `@/*` maps to `./src/*` in mobile TypeScript.

### Web Routing
React Router 7 with all routes lazy-loaded under a `ProtectedRoute`:
`/` Dashboard, `/find-care`, `/find-care/:id`, `/benefits`, `/prescriptions`, `/claims`, `/claims/:id`, `/claims/submit`

### State Management
- **Server state:** TanStack React Query (both apps) with AsyncStorage persistence on mobile.
- **Client state:** Zustand stores on mobile (`useAuthStore`, `useUiStore`). Web relies on React Query + Descope SDK state.
- **Offline:** Network errors trigger an offline banner via `useUiStore`.
- For saving data into Mobile use PersistZustand (AsyncStorage) and SQLite

### Testing Architecture
- **Web unit tests:** Vitest + jsdom + React Testing Library
-  Jest + React Native Testing 
- Test files colocated: Component.test.tsx
- **Web E2E:** Playwright BDD — write `.feature` files in Gherkin, run `bddgen` to generate step glue, then `playwright test`. Config in `playwright.config.ts`: Chromium/Firefox/Safari + mobile viewports, 2 retries in CI.
- **Mobile E2E:** Detox gray-box tests with Jest + jest-cucumber. Always build first (`expo prebuild --clean` is baked into Detox build configs). Sequential execution (maxWorkers: 1). Config in `.detoxrc.ts`.


