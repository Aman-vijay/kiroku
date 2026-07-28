import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  plugins: [
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackStart(),
    nitro(),
    devtools(),
    tailwindcss(),
    viteReact(),
  ],
})

export default config
