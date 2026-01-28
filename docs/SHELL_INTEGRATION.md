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
    // Step 1: Access the Module Federation container from webpack runtime
    // The exact method depends on your Module Federation setup
    // Option A: If using @originjs/vite-plugin-federation in the shell
    const container = await import('remoteApp_core/bootstrap');
    const remoteAppInstance = container.default;
    
    // Option B: If using webpack Module Federation
    // const container = window.__webpack_require__.federation.remoteApp_core;
    // const factory = await container.get('./bootstrap');
    // const module = factory();
    // const remoteAppInstance = module.default;
    
    // Step 2: Verify it has the mount function
    if (!remoteAppInstance || typeof remoteAppInstance.mount !== 'function') {
      throw new Error('Bootstrap loaded but RemoteAppInstance not available');
    }
    
    console.log('✅ Core app loaded successfully');
    return remoteAppInstance;
  } catch (error) {
    console.error('❌ Failed to load core app:', error);
    throw error;
  }
}
```

**What happens:**
1. `remoteEntry.js` loads → Module Federation container is available
2. Shell calls `__webpack_require__.federation.remoteApp_core.get('./bootstrap')` → returns factory function
3. Shell calls `factory()` → loads and executes bootstrap module
4. Bootstrap sets `window.remoteApp_core = remoteApp` (the `RemoteAppInstance`)
5. Shell gets `module.default` → this is the same `RemoteAppInstance`
6. Shell can now call `remoteAppInstance.mount()` and `unmount()`

**IMPORTANT:** The shell MUST use `module.default` to get the instance. Do not rely on `window.remoteApp_core` being set by the container.

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

### "Remote app does not implement required mount() function"

**Symptoms:**
- Console shows "Remote app 'core' loaded successfully"
- Error: "Remote app 'core' does not implement required mount() function"
- Placeholder stub is displayed

**Cause:** The shell is not accessing `module.default` after calling `factory()`.

**Solution:** Update the shell's loader to get the RemoteAppInstance from `module.default`:

```typescript
const factory = await window.remoteApp_core.get('./bootstrap');
const module = factory();
const remoteAppInstance = module.default || module; // ← Get default export
```

See the complete correct implementation in section 3 above.

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
