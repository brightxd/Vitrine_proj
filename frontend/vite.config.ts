import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: env.HOST || 'localhost',
      port: Number(env.PORT) || 5173,
      proxy: {
        '/api': {
          target: env.API_TARGET || 'http://localhost:3335',
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  };
});
