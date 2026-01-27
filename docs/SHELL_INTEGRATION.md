# Shell Integration Guide

This document explains how to integrate the **react-app-core** remote module into the **react-app-shell**.

## Module Federation Configuration

### Core App (Remote)

- **Remote Name:** `remoteApp_core`
- **Exposed Module:** `./bootstrap`
- **Remote Entry URL:** `https://react-app-core-dev.reddune-3f892dde.northeurope.azurecontainerapps.io/assets/remoteEntry.js`

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

### 2. Import the Bootstrap Module

**CRITICAL:** You must explicitly import the bootstrap module to expose `window.remoteApp_core`:

```typescript
// In your shell's remote loader
async function loadCoreApp() {
  try {
    // Import the bootstrap module - this sets window.remoteApp_core
    const bootstrap = await import('remoteApp_core/bootstrap');
    
    // Now window.remoteApp_core is available
    if (window.remoteApp_core) {
      console.log('✅ Core app loaded successfully');
      return window.remoteApp_core;
    } else {
      throw new Error('Bootstrap loaded but window.remoteApp_core not set');
    }
  } catch (error) {
    console.error('❌ Failed to load core app:', error);
    throw error;
  }
}
```

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

### "Remote app did not expose an instance on window.remoteApp_core"

**Cause:** The bootstrap module was not imported.

**Solution:** Ensure you explicitly import `'remoteApp_core/bootstrap'` after loading the remoteEntry.js.

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

**Key Points:**
1. ✅ Configure remote in Module Federation config
2. ✅ **Explicitly import** `'remoteApp_core/bootstrap'` to expose `window.remoteApp_core`
3. ✅ Use the RemoteAppContract interface to mount/unmount
4. ✅ Handle navigation via `onNavigate` callback
5. ✅ Use environment-specific remote entry URLs

The core app **cannot** auto-expose `window.remoteApp_core` - the shell **must** explicitly import the bootstrap module. This is the correct Module Federation pattern.
