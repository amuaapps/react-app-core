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

// Do NOT append auto-initialization code to remoteEntry.js
// The shell must explicitly import the bootstrap module after loading remoteEntry.js
// This is the correct Module Federation pattern

console.log('✅ remoteEntry.js ready for Module Federation');
console.log(`   Bootstrap module: ${bootstrapFile}`);
console.log('');
console.log('⚠️  IMPORTANT: The shell must explicitly load the bootstrap module:');
console.log('   const remoteApp = await import("remoteApp_core/bootstrap");');
console.log('   // Now window.remoteApp_core is available');
