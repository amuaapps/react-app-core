/**
 * Remote App Contract v1
 * 
 * This contract defines the interface between the shell and remote applications.
 * Each remote app must implement this contract to be mountable by the shell.
 */

export const REMOTE_APP_CONTRACT_VERSION = '1';

/**
 * Options passed to the remote app's mount function
 */
export interface RemoteAppMountOptions {
  /**
   * Base path for the remote app (e.g., '/core')
   * The app should handle all routes under this base path
   */
  basePath?: string;

  /**
   * Initial path to navigate to on mount (e.g., '/core/about')
   * If not provided, the app should use basePath
   */
  initialPath?: string;

  /**
   * Callback invoked when the remote app wants to navigate
   * The shell will handle the navigation and may update the browser URL
   */
  onNavigate?: (path: string) => void;

  /**
   * Contract version expected by the shell
   * Remote app should validate this matches its own version
   */
  contractVersion?: string;
}

/**
 * Result returned by the mount function
 */
export interface RemoteAppMountResult {
  /**
   * Whether the mount operation succeeded
   */
  success: boolean;

  /**
   * Error message if mount failed
   */
  error?: string;
}

/**
 * Error types that can occur during mount
 */
export enum RemoteAppErrorType {
  MISSING_CONTAINER = 'MISSING_CONTAINER',
  INVALID_CONTRACT_VERSION = 'INVALID_CONTRACT_VERSION',
  MOUNT_FAILED = 'MOUNT_FAILED',
}

/**
 * Remote app instance interface
 * This is what gets exposed globally (e.g., window.remoteApp_core)
 */
export interface RemoteAppInstance {
  /**
   * Contract version implemented by this remote app
   */
  contractVersion: string;

  /**
   * Mount the remote app into the provided container
   * @param container - DOM element to mount into
   * @param options - Mount options from the shell
   * @returns Result indicating success or failure
   */
  mount: (
    container: HTMLElement,
    options?: RemoteAppMountOptions
  ) => RemoteAppMountResult;

  /**
   * Unmount the remote app and clean up resources
   * Optional but recommended for proper cleanup
   */
  unmount?: () => void;
}
