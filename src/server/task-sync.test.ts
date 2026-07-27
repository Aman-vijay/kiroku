/**
 * Port of scripts/phase2-test.mjs — pure body auto-sync rules (no DB).
 */
import { describe, expect, it } from 'vitest'
import { applyTaskLineToBody, taskLine } from './task'

describe('taskLine / applyTaskLineToBody (phase2)', () => {
  it('formats a completed checkbox line', () => {
    expect(taskLine('Review resume')).toBe('- [x] Review resume')
  })

  it('auto-creates body on first tick', () => {
    expect(applyTaskLineToBody('', 'Review resume', true)).toBe(
      '- [x] Review resume',
    )
  })

  it('appends a second task line', () => {
    const body = taskLine('Review resume')
    expect(applyTaskLineToBody(body, 'Mock interview', true)).toBe(
      `${taskLine('Review resume')}\n${taskLine('Mock interview')}`,
    )
  })

  it('removes a line on untick without losing others', () => {
    const body = `${taskLine('Review resume')}\n${taskLine('Mock interview')}`
    expect(applyTaskLineToBody(body, 'Review resume', false)).toBe(
      taskLine('Mock interview'),
    )
  })

  it('is idempotent on re-tick', () => {
    const body = taskLine('Mock interview')
    expect(applyTaskLineToBody(body, 'Mock interview', true)).toBeNull()
  })

  it('is a no-op when unticking a missing line', () => {
    expect(applyTaskLineToBody('hello', 'Missing', false)).toBeNull()
  })
})
