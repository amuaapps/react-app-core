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
// Use Module Federation's get() function to load the bootstrap module
const autoInitCode = `

// Auto-initialize window.remoteApp_core
(async function() {
  try {
    // Use Module Federation's get() function to load the bootstrap module
    // This is the proper way to load exposed modules from a remote
    const container = await get('./bootstrap');
    const factory = await container();
    const module = factory();
    
    // The module should have already set window.remoteApp_core
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
