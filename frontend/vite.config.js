import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    global: 'window',
    'process.env': {},
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});

