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
// Use absolute path from the current script's location
const autoInitCode = `

// Auto-initialize window.remoteApp_core
(async function() {
  try {
    // Get the base URL from the current script location
    const scriptUrl = document.currentScript?.src || import.meta.url;
    const baseUrl = scriptUrl.substring(0, scriptUrl.lastIndexOf('/') + 1);
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
