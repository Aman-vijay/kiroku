import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    nitroV2Plugin({
      preset: 'vercel',
      compatibilityDate: '2026-07-18',
    }),
    viteReact(),
  ],
})

export default config
