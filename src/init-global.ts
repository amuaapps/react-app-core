/**
 * Auto-initialization for window.remoteApp_core
 *
 * This file is the actual entry point that gets loaded by remoteEntry.js.
 * It immediately imports and executes bootstrap to expose window.remoteApp_core.
 */

// Import bootstrap which sets window.remoteApp_core
import './bootstrap';

// The bootstrap module already handles the window exposure
// This file just ensures it gets executed immediately
