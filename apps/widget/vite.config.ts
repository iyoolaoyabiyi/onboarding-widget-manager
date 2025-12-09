import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'OnboardingTour',
      fileName: (format) => `onboarding-tour.${format}.js`,
      formats: ['umd'],
    },
    outDir: 'dist',
    minify: true,
    rollupOptions: {
      output: {
        // Ensure the UMD build works globally
        globals: {},
      },
    },
  },
});