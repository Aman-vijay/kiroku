import { useState } from 'react'
import {
  captureCardBlob,
  captureCardPng,
  downloadDataUrl,
} from '../lib/export-card'
import {
  disableEntryShare,
  enableEntryShare,
} from '#/server/entries'

type ShareActionsProps = {
  entryId?: string
  entryDate: string
  shareSlug?: string | null
  onShareSlugChange?: (slug: string | null) => void
}

export function ShareActions({
  entryId,
  entryDate,
  shareSlug,
  onShareSlugChange,
}: ShareActionsProps) {
  const [busy, setBusy] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [slug, setSlug] = useState(shareSlug ?? null)

  function cardEl() {
    const el = document.getElementById('share-card')
    if (!el) throw new Error('Card preview not found')
    return el
  }

  async function handleDownload() {
    setMsg(null)
    setBusy('download')
    try {
      const dataUrl = await captureCardPng(cardEl())
      downloadDataUrl(dataUrl, `kiroku-${entryDate}.png`)
      setMsg('PNG downloaded')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setBusy(null)
    }
  }

  async function handleNativeShare() {
    setMsg(null)
    setBusy('share')
    try {
      const blob = await captureCardBlob(cardEl())
      const file = new File([blob], `kiroku-${entryDate}.png`, {
        type: 'image/png',
      })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Kiroku',
          text: `My day — ${entryDate}`,
        })
        setMsg('Shared')
      } else {
        const dataUrl = await captureCardPng(cardEl())
        downloadDataUrl(dataUrl, `kiroku-${entryDate}.png`)
        setMsg('Share not available — downloaded instead')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setMsg(err instanceof Error ? err.message : 'Share failed')
    } finally {
      setBusy(null)
    }
  }

  async function handleEnableLink() {
    if (!entryId) {
      setMsg('Save the entry first to get a link')
      return
    }
    setMsg(null)
    setBusy('link')
    try {
      const result = await enableEntryShare({ data: { id: entryId } })
      setSlug(result.shareSlug)
      onShareSlugChange?.(result.shareSlug)
      const url = `${window.location.origin}/s/${result.shareSlug}`
      await navigator.clipboard.writeText(url)
      setMsg('Link copied')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not create link')
    } finally {
      setBusy(null)
    }
  }

  async function handleCopyLink() {
    if (!slug) return
    setMsg(null)
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/s/${slug}`,
      )
      setMsg('Link copied')
    } catch {
      setMsg('Could not copy')
    }
  }

  async function handleDisableLink() {
    if (!entryId) return
    setBusy('unlink')
    setMsg(null)
    try {
      await disableEntryShare({ data: { id: entryId } })
      setSlug(null)
      onShareSlugChange?.(null)
      setMsg('Link disabled')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not disable')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-accent !py-1.5 !px-3 text-xs"
          disabled={!!busy}
          onClick={() => void handleDownload()}
        >
          {busy === 'download' ? 'Exporting…' : 'Download PNG'}
        </button>
        <button
          type="button"
          className="btn btn-secondary !py-1.5 !px-3 text-xs"
          disabled={!!busy}
          onClick={() => void handleNativeShare()}
        >
          {busy === 'share' ? 'Sharing…' : 'Share image'}
        </button>
        {slug ? (
          <>
            <button
              type="button"
              className="btn btn-secondary !py-1.5 !px-3 text-xs"
              disabled={!!busy}
              onClick={() => void handleCopyLink()}
            >
              Copy link
            </button>
            <button
              type="button"
              className="btn btn-ghost !py-1.5 !px-3 text-xs"
              disabled={!!busy}
              onClick={() => void handleDisableLink()}
            >
              {busy === 'unlink' ? '…' : 'Unlist'}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-secondary !py-1.5 !px-3 text-xs"
            disabled={!!busy || !entryId}
            onClick={() => void handleEnableLink()}
            title={!entryId ? 'Save first' : undefined}
          >
            {busy === 'link' ? 'Creating…' : 'Get unlisted link'}
          </button>
        )}
      </div>
      {slug ? (
        <p className="m-0 break-all text-xs text-[var(--muted)]">
          /s/{slug}
        </p>
      ) : null}
      {msg ? (
        <p className="m-0 text-xs text-[var(--muted)]" role="status">
          {msg}
        </p>
      ) : null}
    </div>
  )
}
