import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// add the beginning of your app entry



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  /* build: {
    // generate manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: 'src/main.tsx'
    }
  } */
})