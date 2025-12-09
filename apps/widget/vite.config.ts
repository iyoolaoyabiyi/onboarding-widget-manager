import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts', 
      name: 'OnboardingTour', 
      fileName: (format) => `onboarding-tour.${format}.js`,
      formats: ['umd'],
    },
    
    outDir: 'dist', 
    minify: true, 
    rollupOptions: {
    },
  },
});