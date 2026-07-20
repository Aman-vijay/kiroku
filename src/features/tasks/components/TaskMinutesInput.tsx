import { useEffect, useState } from 'react'

type TaskMinutesInputProps = {
  taskId: string
  minutes: number | null
  disabled?: boolean
  onCommit: (id: string, minutes: number | null) => void | Promise<void>
}

/**
 * Compact minutes input that lights up when a task is done.
 * Persists on blur / Enter. Empty = null (no time tracked).
 */
export function TaskMinutesInput({
  taskId,
  minutes,
  disabled,
  onCommit,
}: TaskMinutesInputProps) {
  const [value, setValue] = useState(minutes == null ? '' : String(minutes))
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setValue(minutes == null ? '' : String(minutes))
  }, [minutes])

  async function commit() {
    const trimmed = value.trim()
    const next = trimmed === '' ? null : Math.max(0, Math.min(1440, Number(trimmed) || 0))
    if (next === minutes) {
      setValue(minutes == null ? '' : String(minutes))
      return
    }
    setPending(true)
    try {
      await onCommit(taskId, next)
    } finally {
      setPending(false)
    }
  }

  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      max={1440}
      value={value}
      disabled={disabled || pending}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => void commit()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          ;(e.target as HTMLInputElement).blur()
        }
      }}
      aria-label="Minutes spent"
      className="w-16 rounded-[8px] border border-[var(--line)] bg-[var(--bg)] px-2 py-1 text-right text-xs text-[var(--ink)] focus:border-[var(--ring)] focus:outline-none disabled:opacity-50"
      placeholder="min"
    />
  )
}