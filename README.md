# react-app-core

Remote application for the Amua Apps micro-frontend architecture. This app is mounted by `react-app-shell` and provides core functionality without shell chrome (navigation/footer).

## Architecture

This is a **remote application** using Module Federation that:
- Exposes `window.remoteApp_core` with contract version 1
- Provides a stable `remoteEntry.js` (non-hashed) for shell consumption
- Implements mount/unmount interface for dynamic loading
- Renders content without shell chrome (shell provides top nav + footer)

## Remote App Contract

```typescript
interface RemoteAppCore {
  contractVersion: '1';
  mount(container: HTMLElement, options?: {
    basePath?: string;
    initialPath?: string;
    onNavigate?: (path: string) => void;
    contractVersion?: string;
  }): { success: boolean; error?: string };
  unmount(): void;
}
```

## Setup

### Prerequisites
- Node.js 18.20.5 (see `.nvmrc`)
- Access to GitHub Packages for `@amuaapps` scoped packages
- `NPM_PACKAGE_TOKEN` environment variable set

### Installation

```bash
# Use correct Node version
nvm use

# Install dependencies
npm ci

# Start dev server (runs on port 3001)
npm run dev
```

## Development

### Available Scripts

- `npm run dev` - Start Vite dev server with HMR
- `npm run build` - Type check and build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:coverage` - Run tests with coverage report

### Project Structure

```
src/
├── App.tsx              # Main app component
├── bootstrap.tsx        # Remote app bootstrap & contract implementation
├── main.tsx            # Entry point
├── pages/              # Page components
│   └── PlaceholderPage.tsx
├── styles/             # Global styles & design tokens
│   └── globals.css
└── vite-env.d.ts       # Vite type definitions

tests/
├── setup.ts            # Jest setup
├── __mocks__/          # Module mocks
├── unit/               # Unit tests
└── integration/        # Integration tests
```

## Standards Compliance

This project follows the Amua Apps coding standards defined in `docs/agents.md`:

- **TypeScript strict mode** - No `any`, full type safety
- **Token-first UI** - All styling via design tokens (see `docs/design-tokens.md`)
- **WCAG AA accessibility** - Semantic HTML, keyboard nav, ARIA
- **70% test coverage** - Unit + integration tests with Jest
- **CI/CD pipeline** - 4-stage blue/green deployment (see `docs/pipeline-contract.md`)

## Theme Strategy

The core app avoids duplicating theme CSS when mounted by the shell:

- **Shell environment**: Shell provides theme tokens globally, core app uses them
- **Standalone dev**: `standalone.tsx` loads `globals.css` for local development
- **Remote entry**: `bootstrap.tsx` does NOT import `globals.css` (prevents duplication)

See `docs/theme-strategy.md` for full details on token-based styling and theme loading.

## Local Development

The app runs standalone on port 3001 for local development. The `index.html` file mounts the remote app automatically.

To test integration with the shell:
1. Build this app: `npm run build`
2. Serve the `dist` folder
3. Configure shell to load `remoteEntry.js` from your local server

## Build Output

The production build creates both a standalone SPA and a remote entry for shell consumption:

```
dist/
├── index.html                    # SPA entry point for standalone debugging
├── assets/
│   ├── remoteEntry.js           # Stable (non-hashed) remote entry for shell
│   ├── style-*.css              # Hashed stylesheets
│   ├── index-*.js               # Hashed SPA chunks
│   ├── __federation_*.js        # Module Federation runtime chunks
│   └── __federation_expose_Bootstrap-*.js  # Exposed bootstrap module
```

**Key files:**
- `assets/remoteEntry.js` - Stable filename for shell to load (exposes `window.remoteApp_core`)
- `index.html` - Serves the app as standalone SPA for local testing and smoke tests
- `assets/*` - All other chunks are hashed for cache busting

**Note:** The Module Federation plugin outputs `remoteEntry.js` to the `assets/` directory. The shell should load it from `${baseUrl}/assets/remoteEntry.js`.

## Deployment

Deployments follow the 4-stage pipeline:
1. **Test** - Lint, typecheck, format check, unit tests, CodeQL, npm audit
2. **Build** - Create container image, push to GHCR
3. **Deploy GREEN** - Deploy to Azure Container Apps (0% traffic)
4. **Verify & Switch** - Integration tests, then blue/green traffic switch

See `docs/pipeline-contract.md` for full pipeline specification.

## License

MIT for Amua Apps.

## Status

This is the develop branch - work in progress.

Coming soon.
