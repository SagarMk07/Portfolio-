import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    modulePreload: {
      resolveDependencies(_url, deps, { hostType }) {
        if (hostType === 'html') {
          // Never preload 3D WebGL runtime in initial HTML; let critical Hero DOM paint first
          return deps.filter(
            dep => !dep.includes('three') && !dep.includes('PortfolioScene') && !dep.includes('NeuralNetwork')
          )
        }
        return deps
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          three: ['three', '@react-three/fiber'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
