import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '169.254.0.21',
      '3001-i24iekgqerbpvl5pg9e4z-69ab2618.sg1.manus.computer',
      '.manus.computer',
    ],
  },
})
