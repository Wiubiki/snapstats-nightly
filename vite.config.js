import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace this with your actual repo name
const repoName = 'snapstats';

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
});
