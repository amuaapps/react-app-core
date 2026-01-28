# Shell Integration Guide

This document explains how to integrate the **react-app-core** remote module into the **react-app-shell**.

## Module Federation Configuration

### Core App (Remote) - ✅ Already Configured

The core app is **already correctly configured** in `vite.config.ts`:

```typescript
federation({
  name: 'remoteApp_core',
  filename: 'remoteEntry.js',
  exposes: {
    './bootstrap': './src/bootstrap.tsx',  // ✅ Exposes bootstrap module
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

**Key Details:**
- **Remote Name:** `remoteApp_core`
- **Exposed Module:** `./bootstrap` → `./src/bootstrap.tsx`
- **Remote Entry URL:** `https://react-app-core-dev.reddune-3f892dde.northeurope.azurecontainerapps.io/assets/remoteEntry.js`
- **Global Exposure:** The bootstrap module sets `window.remoteApp_core` when imported

### Shell App (Host)

The shell must configure Module Federation to load the core app as a remote.

## Integration Steps

### 1. Load the Remote Entry

First, configure the remote in your Vite/Webpack config:

```typescript
// vite.config.ts (shell)
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      name: 'shell',
      remotes: {
        remoteApp_core: 'https://react-app-core-dev.reddune-3f892dde.northeurope.azurecontainerapps.io/assets/remoteEntry.js',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
});
```

### 2. Access the Module Federation Container

**The container is automatically available** after loading `remoteEntry.js`:

```typescript
// After loading remoteEntry.js, window.remoteApp_core is available
// It contains the Module Federation container with get() and init() functions
interface ModuleFederationContainer {
  get: (module: string) => Promise<() => any>;
  init: (shared: any) => void;
}

declare global {
  interface Window {
    remoteApp_core: ModuleFederationContainer;
  }
}
```

### 3. Load the Bootstrap Module

**CRITICAL FIX:** The shell's current loader is checking `window.remoteApp_core` immediately after loading the container, but it needs to call `get()` first to load the bootstrap module.

**Current shell code (INCORRECT):**
```typescript
// ❌ This checks too early - container doesn't have mount() function
if (window.remoteApp_core && typeof window.remoteApp_core.mount === 'function') {
  return window.remoteApp_core;
}
```

**Correct implementation:**

```typescript
// In your shell's remote loader (loader.ts)
async function loadCoreApp() {
  try {
    // Step 1: Verify container is available
    if (!window.remoteApp_core || typeof window.remoteApp_core.get !== 'function') {
      throw new Error('Module Federation container not available');
    }
    
    // Step 2: Use container's get() to load bootstrap module
    const factory = await window.remoteApp_core.get('./bootstrap');
    const module = factory();
    
    // Step 3: Bootstrap has now replaced window.remoteApp_core with RemoteAppInstance
    // Verify it has the mount function
    if (!window.remoteApp_core || typeof window.remoteApp_core.mount !== 'function') {
      throw new Error('Bootstrap loaded but RemoteAppInstance not available');
    }
    
    console.log('✅ Core app loaded successfully');
    return window.remoteApp_core;
  } catch (error) {
    console.error('❌ Failed to load core app:', error);
    throw error;
  }
}
```

**What happens:**
1. `remoteEntry.js` loads → `window.remoteApp_core = { get, init }`
2. Shell calls `window.remoteApp_core.get('./bootstrap')` → loads bootstrap module
3. Bootstrap executes → **replaces** `window.remoteApp_core` with `RemoteAppInstance`
4. Shell verifies `window.remoteApp_core.mount` exists
5. Shell can now call `mount()` and `unmount()`

### 3. Mount the Core App

Once loaded, use the RemoteAppContract to mount the app:

```typescript
const remoteApp = await loadCoreApp();

const result = remoteApp.mount(containerElement, {
  basePath: '/core',
  initialPath: '/core',
  onNavigate: (path) => {
    // Handle navigation from core app
    shellRouter.navigate(path);
  },
  contractVersion: '1',
});

if (!result.success) {
  console.error('Failed to mount core app:', result.error);
}
```

### 4. Unmount When Done

```typescript
remoteApp.unmount();
```

## RemoteAppContract Interface

The core app implements RemoteAppContract v1:

```typescript
interface RemoteAppInstance {
  contractVersion: string; // "1"
  mount(container: HTMLElement, options: RemoteAppMountOptions): RemoteAppMountResult;
  unmount(): RemoteAppMountResult;
}

interface RemoteAppMountOptions {
  basePath?: string;           // Default: '/core'
  initialPath?: string;        // Default: basePath
  onNavigate?: (path: string) => void;
  contractVersion?: string;    // Must be "1"
}

type RemoteAppMountResult = 
  | { success: true; error?: undefined }
  | { success: false; error: string };
```

## Environment-Specific URLs

Configure different remote entry URLs per environment:

```typescript
const REMOTE_CORE_URL = {
  dev: 'https://react-app-core-dev.reddune-3f892dde.northeurope.azurecontainerapps.io/assets/remoteEntry.js',
  staging: 'https://react-app-core-staging.reddune-3f892dde.northeurope.azurecontainerapps.io/assets/remoteEntry.js',
  prod: 'https://react-app-core-prod.reddune-3f892dde.northeurope.azurecontainerapps.io/assets/remoteEntry.js',
}[import.meta.env.MODE];
```

## Troubleshooting

### Placeholder stub shows instead of core app

**Symptoms:**
- Console shows "Remote app 'core' loaded successfully"
- Placeholder stub is displayed instead of the actual core app
- No errors, just warnings

**Cause:** The shell's loader is checking for `window.remoteApp_core.mount` **before** calling `get('./bootstrap')`.

**Solution:** Update the shell's loader to:
1. First call `window.remoteApp_core.get('./bootstrap')`
2. **Then** check for `window.remoteApp_core.mount`

See the correct implementation in section 3 above.

### "Remote app did not expose an instance on window.remoteApp_core"

**Cause:** The `remoteEntry.js` was not loaded or the container exposure code is missing.

**Solution:** 
- Verify `remoteEntry.js` loads successfully
- Check that `window.remoteApp_core` exists and has `get` and `init` functions
- Ensure you're using the latest deployment of the core app

### "Failed to fetch dynamically imported module"

**Cause:** Incorrect remote entry URL or CORS issues.

**Solution:** 
- Verify the remote entry URL is correct
- Check that CORS headers are set on the remote server
- Ensure the remote app is deployed and accessible

### Module not found errors

**Cause:** Module Federation configuration mismatch.

**Solution:**
- Verify the remote name matches: `remoteApp_core`
- Verify the exposed module name: `./bootstrap`
- Check that shared dependencies (React, React-DOM) are configured as singletons

## Complete Example

```typescript
// Shell's remote app loader
import { RemoteAppInstance } from '@/types/remote-app-contract';

class CoreAppLoader {
  private remoteApp: RemoteAppInstance | null = null;
  
  async load(): Promise<RemoteAppInstance> {
    if (this.remoteApp) {
      return this.remoteApp;
    }
    
    // Import bootstrap module to expose window.remoteApp_core
    await import('remoteApp_core/bootstrap');
    
    if (!window.remoteApp_core) {
      throw new Error('Core app failed to expose window.remoteApp_core');
    }
    
    this.remoteApp = window.remoteApp_core;
    return this.remoteApp;
  }
  
  async mount(container: HTMLElement, basePath: string) {
    const app = await this.load();
    
    const result = app.mount(container, {
      basePath,
      initialPath: basePath,
      onNavigate: (path) => {
        // Handle navigation
        window.history.pushState({}, '', path);
      },
      contractVersion: '1',
    });
    
    if (!result.success) {
      throw new Error(`Mount failed: ${result.error}`);
    }
  }
  
  unmount() {
    if (this.remoteApp) {
      this.remoteApp.unmount();
    }
  }
}

export const coreAppLoader = new CoreAppLoader();
```

## Summary

**Core App Status:**
- ✅ Module Federation is **correctly configured** in `vite.config.ts`
- ✅ Bootstrap module is **correctly exposed** as `./bootstrap`
- ✅ Bootstrap module **correctly sets** `window.remoteApp_core` when imported
- ✅ RemoteAppContract v1 is **fully implemented**

**Shell Requirements:**
1. ✅ Configure remote in Module Federation config
2. ✅ **Explicitly import** `'remoteApp_core/bootstrap'` to expose `window.remoteApp_core`
3. ✅ Use the RemoteAppContract interface to mount/unmount
4. ✅ Handle navigation via `onNavigate` callback
5. ✅ Use environment-specific remote entry URLs

**Important:**
The core app **cannot** auto-expose `window.remoteApp_core` when `remoteEntry.js` loads. The shell **must** explicitly import the bootstrap module. This is the standard Module Federation pattern - remotes do not auto-execute, hosts must explicitly import exposed modules.
