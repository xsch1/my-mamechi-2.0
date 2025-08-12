import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/my-mamechi-2.0/', // 리포 이름 그대로
  build: { outDir: 'dist' },
});
