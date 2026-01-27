/**
 * Remote Entry Point
 * 
 * This file is the entry point for the remote app when loaded by the shell.
 * It exposes window.remoteApp_core with the contract v1 interface.
 */

import remoteApp from './bootstrap';

// Re-export the remote app instance
// This ensures window.remoteApp_core is available when this module loads
export default remoteApp;
