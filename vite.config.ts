import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      external: ['@supabase/supabase-js'], // Explicitly mark @supabase/supabase-js as external
    },
  },
  resolve: {
    alias: {
      '@supabase/supabase-js': '/node_modules/@supabase/supabase-js', // Optional alias to help resolve the module
    },
  },
});
