import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Sørger for at React ikke blir bundlet to ganger dersom noe importerer en annen kopi
  resolve: { dedupe: ['react', 'react-dom'] },
})
