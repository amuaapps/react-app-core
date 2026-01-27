import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/globals.css';

interface MountOptions {
  basePath?: string;
  initialPath?: string;
  onNavigate?: (path: string) => void;
  contractVersion?: string;
}

interface MountResult {
  success: boolean;
  error?: string;
}

interface RemoteAppCore {
  contractVersion: string;
  mount: (container: HTMLElement, options?: MountOptions) => MountResult;
  unmount: () => void;
}

let root: ReactDOM.Root | null = null;

const remoteApp: RemoteAppCore = {
  contractVersion: '1',

  mount(container: HTMLElement, options: MountOptions = {}): MountResult {
    try {
      if (!container) {
        return {
          success: false,
          error: 'Container element is required',
        };
      }

      if (options.contractVersion && options.contractVersion !== '1') {
        return {
          success: false,
          error: `Unsupported contract version: ${options.contractVersion}. Expected: 1`,
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
        error: error instanceof Error ? error.message : 'Unknown error',
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
if (typeof window !== 'undefined') {
  (window as typeof window & { remoteApp_core: RemoteAppCore }).remoteApp_core =
    remoteApp;
}

export default remoteApp;
