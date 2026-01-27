import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
// NOTE: Do NOT import globals.css here - the shell already loads theme tokens globally
// For standalone dev, globals.css is imported in index.html via main.tsx
import {
  REMOTE_APP_CONTRACT_VERSION,
  RemoteAppErrorType,
  type RemoteAppInstance,
  type RemoteAppMountOptions,
  type RemoteAppMountResult,
} from '@/lib/remote-app-contract';

let root: ReactDOM.Root | null = null;

const remoteApp: RemoteAppInstance = {
  contractVersion: REMOTE_APP_CONTRACT_VERSION,

  mount(
    container: HTMLElement,
    options: RemoteAppMountOptions = {}
  ): RemoteAppMountResult {
    try {
      if (!container) {
        return {
          success: false,
          error: `${RemoteAppErrorType.MISSING_CONTAINER}: Container element is required`,
        };
      }

      if (
        options.contractVersion &&
        options.contractVersion !== REMOTE_APP_CONTRACT_VERSION
      ) {
        return {
          success: false,
          error: `${RemoteAppErrorType.INVALID_CONTRACT_VERSION}: Unsupported contract version: ${options.contractVersion}. Expected: ${REMOTE_APP_CONTRACT_VERSION}`,
        };
      }

      root = ReactDOM.createRoot(container);
      root.render(
        <React.StrictMode>
          <App
            basePath={options.basePath}
            initialPath={options.initialPath}
            onNavigate={options.onNavigate}
          />
        </React.StrictMode>
      );

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `${RemoteAppErrorType.MOUNT_FAILED}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },

  unmount() {
    if (root) {
      root.unmount();
      root = null;
    }
  },
};

// Expose the remote app instance globally
// This MUST happen immediately when this module loads
if (typeof window !== 'undefined') {
  (
    window as typeof window & { remoteApp_core: RemoteAppInstance }
  ).remoteApp_core = remoteApp;
}

export default remoteApp;
