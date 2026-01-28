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

// Append code to expose the Module Federation container on window
// This allows the shell to access the container directly
const containerExposureCode = `

// Expose the Module Federation container on window
// This makes the container available as window.remoteApp_core
if (typeof window !== 'undefined') {
  window.remoteApp_core = { get, init };
}
`;

// Append the code
content += containerExposureCode;

// Write back
fs.writeFileSync(remoteEntryPath, content, 'utf8');

console.log('✅ remoteEntry.js modified to expose container on window.remoteApp_core');
console.log(`   Bootstrap module: ${bootstrapFile}`);
console.log('   Container exports: get, init');
