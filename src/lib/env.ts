const isServerRuntime = typeof window === 'undefined' || Boolean((import.meta as ImportMeta & { env?: { SSR?: boolean } }).env?.SSR)

if (isServerRuntime) {
  try {
    const { readFileSync } = await import('node:fs')
    const { resolve } = await import('node:path')
    const cwd = process.cwd()

    for (const file of ['.env.local', '.env']) {
      const filePath = resolve(cwd, file)
      try {
        const content = readFileSync(filePath, 'utf8')
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith('#')) continue
          const separatorIndex = trimmed.indexOf('=')
          if (separatorIndex === -1) continue
          const key = trimmed.slice(0, separatorIndex).trim()
          let value = trimmed.slice(separatorIndex + 1).trim()
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1)
          }
          if (!process.env[key]) {
            process.env[key] = value
          }
        }
      } catch {
        // Ignore missing files and continue with the next fallback.
      }
    }
  } catch {
    // Ignore in environments where the file loader is unavailable.
  }
}

function getRuntimeEnv(name: string) {
  const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | boolean | undefined> }).env
  const viteValue = viteEnv?.[name] ?? viteEnv?.[`VITE_${name}`]
  if (typeof viteValue === 'string' && viteValue) {
    return viteValue
  }

  const processValue = typeof process !== 'undefined' ? process.env[name] ?? process.env[`VITE_${name}`] : undefined
  if (typeof processValue === 'string' && processValue) {
    return processValue
  }

  return undefined
}

export function getRequiredEnv(name: string) {
  const value = getRuntimeEnv(name)
  if (!value) {
    if (!isServerRuntime) {
      return ''
    }
    throw new Error(`${name} is not set. Check your .env.local file.`)
  }
  return value
}
