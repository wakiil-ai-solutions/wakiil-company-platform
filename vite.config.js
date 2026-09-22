import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/wakiil-automation-demo/',
  plugins: [react()],
});
