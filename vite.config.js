import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths()
  ],
  resolve: {
    alias: {
      'components': path.resolve(__dirname, './src/components'),
      'pages': path.resolve(__dirname, './src/pages'),
      'styles': path.resolve(__dirname, './src/styles'),
    }
  },
  server: {
    port: 5173,
    open: false
  }
});
