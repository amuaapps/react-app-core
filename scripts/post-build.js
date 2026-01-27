#!/usr/bin/env node

/**
 * Post-build script to modify remoteEntry.js
 * 
 * This script appends auto-initialization code to remoteEntry.js
 * to ensure window.remoteApp_core is exposed immediately when the script loads.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const remoteEntryPath = path.join(__dirname, '../dist/assets/remoteEntry.js');

// Read the current remoteEntry.js
let content = fs.readFileSync(remoteEntryPath, 'utf8');

// Find the bootstrap module filename from the build output
const distAssetsDir = path.join(__dirname, '../dist/assets');
const files = fs.readdirSync(distAssetsDir);
const bootstrapFile = files.find(f => f.startsWith('__federation_expose_Bootstrap-'));

if (!bootstrapFile) {
  console.error('❌ Could not find bootstrap module in dist/assets/');
  process.exit(1);
}

// Append auto-initialization code
// The remoteEntry.js is a module, so we can use import.meta.url at the top level
const autoInitCode = `

// Auto-initialize window.remoteApp_core
// Capture import.meta.url at module top level before async function
const __remoteEntryUrl = import.meta.url;
(async function() {
  try {
    // Get the base URL from the module's import.meta.url
    const baseUrl = __remoteEntryUrl.substring(0, __remoteEntryUrl.lastIndexOf('/') + 1);
    const bootstrapUrl = baseUrl + '${bootstrapFile}';
    
    const bootstrap = await import(bootstrapUrl);
    if (!window.remoteApp_core) {
      console.warn('[remoteEntry.js] Bootstrap loaded but window.remoteApp_core not set');
    }
  } catch (error) {
    console.error('[remoteEntry.js] Failed to auto-initialize:', error);
  }
})();
`;

// Append the code
content += autoInitCode;

// Write back
fs.writeFileSync(remoteEntryPath, content, 'utf8');

console.log('✅ remoteEntry.js modified to auto-expose window.remoteApp_core');
console.log(`   Bootstrap module: ${bootstrapFile}`);
