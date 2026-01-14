import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    host: true // Optional: allows access from other devices on your local network
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});

