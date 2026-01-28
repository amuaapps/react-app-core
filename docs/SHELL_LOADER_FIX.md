# Shell Loader Fix Required

## Problem

The shell's loader is looking for `window.remoteApp_core` as the Module Federation container, but the core app now exposes the container on `window.__remoteApp_core_container__` to avoid naming conflicts.

## Root Cause

- The core app's `remoteEntry.js` sets `window.__remoteApp_core_container__ = { get, init }`
- The shell's loader is checking for `window.remoteApp_core` (wrong property)
- This causes the error: "Module Federation container 'remoteApp_core' not found on window"

## Solution

Update the shell's remote loader to use `window.__remoteApp_core_container__` instead of `window.remoteApp_core`.

## Required Changes in Shell

### Before (INCORRECT):
```typescript
// Shell's current loader code
const container = window.remoteApp_core; // ❌ Wrong property
if (!container || typeof container.get !== 'function') {
  throw new Error('Module Federation container not available');
}
```

### After (CORRECT):
```typescript
// Updated shell loader code
const container = window.__remoteApp_core_container__; // ✅ Correct property
if (!container || typeof container.get !== 'function') {
  throw new Error('Module Federation container not available');
}

// Load bootstrap module
const factory = await container.get('./bootstrap');
const module = factory();

// Get the RemoteAppInstance - handle both default export and direct export
const remoteAppInstance = module.default || module;

// Verify it has mount function
if (!remoteAppInstance || typeof remoteAppInstance.mount !== 'function') {
  throw new Error('RemoteAppInstance not available');
}

return remoteAppInstance;
```

## Complete Working Example

```typescript
// In shell's src/lib/remote-loader.ts (or similar)
async function loadCoreApp() {
  try {
    // Step 1: Get the Module Federation container
    const container = window.__remoteApp_core_container__;
    if (!container || typeof container.get !== 'function') {
      throw new Error('Module Federation container not available at window.__remoteApp_core_container__');
    }
    
    // Step 2: Load the bootstrap module using container.get()
    const factory = await container.get('./bootstrap');
    const module = factory();
    
    // Step 3: Extract the RemoteAppInstance - handle both export patterns
    const remoteAppInstance = module.default || module;
    
    // Step 4: Verify the instance has the required methods
    if (!remoteAppInstance || typeof remoteAppInstance.mount !== 'function') {
      throw new Error('RemoteAppInstance does not have mount() function');
    }
    
    console.log('✅ Core app loaded successfully');
    return remoteAppInstance;
  } catch (error) {
    console.error('❌ Failed to load core app:', error);
    throw error;
  }
}
```

## Window Properties Explained

After loading `remoteEntry.js`, there are TWO separate properties on `window`:

1. **`window.__remoteApp_core_container__`** (Module Federation container)
   - Type: `{ get: Function, init: Function }`
   - Purpose: Used to load federated modules
   - Set by: `remoteEntry.js` immediately on load

2. **`window.remoteApp_core`** (RemoteAppInstance)
   - Type: `{ mount: Function, unmount: Function, contractVersion: string }`
   - Purpose: Used to mount/unmount the core app
   - Set by: `bootstrap.tsx` when it executes (after calling `get('./bootstrap')`)

## TypeScript Declarations

Add these to your shell's type declarations:

```typescript
interface ModuleFederationContainer {
  get: (module: string) => Promise<() => any>;
  init: (shared: any) => void;
}

interface RemoteAppInstance {
  mount: (container: HTMLElement, options?: any) => { success: boolean; error?: string };
  unmount: () => void;
  contractVersion: string;
}

declare global {
  interface Window {
    __remoteApp_core_container__: ModuleFederationContainer;
    remoteApp_core: RemoteAppInstance;
  }
}
```

## Testing

After making this change, you should see:

1. ✅ "Core app loaded successfully" in console
2. ✅ Core app renders instead of placeholder stub
3. ✅ No errors about missing container or mount function

## Files to Update in Shell

Look for files that reference `window.remoteApp_core` as a container and update them to use `window.__remoteApp_core_container__` instead.

Common locations:
- `src/lib/remote-loader.ts`
- `src/lib/RemoteAppLoader.tsx`
- Any file that calls `.get()` on the remote container
