/**
 * Remote App Initialization Script
 * 
 * This script is loaded AFTER remoteEntry.js to ensure window.remoteApp_core
 * is exposed by importing and executing the bootstrap module.
 * 
 * The shell should load this script after remoteEntry.js:
 * 1. Load remoteEntry.js (defines the remote module)
 * 2. Load init-remote.js (imports bootstrap to expose window.remoteApp_core)
 */

(async function initRemoteAppCore() {
  try {
    // Import the bootstrap module which exposes window.remoteApp_core
    const bootstrap = await import('./assets/__federation_expose_Bootstrap-kljaZNKp.js');
    
    console.log('[init-remote] Bootstrap loaded:', {
      hasDefault: !!bootstrap.default,
      windowExposed: !!window.remoteApp_core,
    });
    
    if (!window.remoteApp_core) {
      console.error('[init-remote] window.remoteApp_core was not exposed by bootstrap!');
    }
  } catch (error) {
    console.error('[init-remote] Failed to initialize remote app:', error);
  }
})();
