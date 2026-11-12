import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    global: 'window',
    'process.env': {},
  },
  server: {
    port: 5173,
    host: true,
  },
});

