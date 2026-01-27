import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remoteApp_core',
      filename: 'remoteEntry.js',
      exposes: {
        './bootstrap': './src/bootstrap.tsx',
      },
      // Ensure bootstrap is loaded immediately to expose window.remoteApp_core
      remotes: {},
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.2.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.2.0',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/layouts': path.resolve(__dirname, './src/layouts'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 3001,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: './index.html',
        initGlobal: './src/init-global.ts',
      },
    },
    // Module Federation plugin handles remoteEntry.js generation
    // The plugin automatically outputs:
    // - dist/remoteEntry.js (stable, non-hashed)
    // - dist/index.html (SPA entry point)
    // - dist/assets/* (hashed chunks and assets)
  },
});
