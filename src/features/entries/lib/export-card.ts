import { domToPng, domToBlob } from 'modern-screenshot'
import { CARD_H, CARD_W } from '#/lib/constants'

/** Capture #share-card at full export size (ignores CSS preview scale). */
export async function captureCardPng(el: HTMLElement): Promise<string> {
  const prev = el.style.transform
  el.style.transform = 'none'
  try {
    return await domToPng(el, {
      width: CARD_W,
      height: CARD_H,
      scale: 1,
      backgroundColor: null,
    })
  } finally {
    el.style.transform = prev
  }
}

export async function captureCardBlob(el: HTMLElement): Promise<Blob> {
  const prev = el.style.transform
  el.style.transform = 'none'
  try {
    const blob = await domToBlob(el, {
      width: CARD_W,
      height: CARD_H,
      scale: 1,
      backgroundColor: null,
    })
    if (!blob) throw new Error('Could not create image')
    return blob
  } finally {
    el.style.transform = prev
  }
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}
