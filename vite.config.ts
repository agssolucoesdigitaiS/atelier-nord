import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativa: o build funciona em qualquer subcaminho (Artifact, Vercel, Netlify, pasta local)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['gsap', 'gsap/ScrollTrigger', '@gsap/react', 'lenis'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
