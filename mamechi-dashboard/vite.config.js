import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/my-mamechi-2.0/', // 여기에 실제 저장소 이름 입력
  build: {
    outDir: 'dist',
  },
});
