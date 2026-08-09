import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SyncController } from './syncController'

describe('SyncController', () => {
  let hidden = false

  beforeEach(() => {
    vi.useFakeTimers()
    hidden = false
    vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden)
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('uses one request loop without accumulating timers over 30 minutes', async () => {
    const fetch = vi.fn(async (rid: number) => ({ rid: rid + 1 }))
    const controller = new SyncController({
      fetch,
      onData: vi.fn(),
      interval: () => 5_000,
    })

    controller.start()
    await vi.advanceTimersByTimeAsync(30 * 60_000)
    controller.stop()
    const callsAtStop = fetch.mock.calls.length
    await vi.advanceTimersByTimeAsync(60_000)

    expect(callsAtStop).toBe(361)
    expect(fetch).toHaveBeenCalledTimes(callsAtStop)
  })

  it('retries with capped exponential backoff and recovers', async () => {
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue({ rid: 1 })
    const controller = new SyncController({
      fetch,
      onData: vi.fn(),
      interval: () => 100,
      maxBackoffMs: 1_000,
    })

    controller.start()
    await vi.advanceTimersByTimeAsync(99)
    expect(fetch).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(1)
    expect(fetch).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(200)
    expect(fetch).toHaveBeenCalledTimes(3)
    controller.stop()
  })

  it('pauses while hidden and synchronizes immediately when visible', async () => {
    hidden = true
    const fetch = vi.fn().mockResolvedValue({ rid: 1 })
    const controller = new SyncController({
      fetch,
      onData: vi.fn(),
      interval: () => 1_000,
    })

    controller.start()
    expect(fetch).not.toHaveBeenCalled()
    hidden = false
    document.dispatchEvent(new Event('visibilitychange'))
    await vi.advanceTimersByTimeAsync(0)

    expect(fetch).toHaveBeenCalledTimes(1)
    controller.stop()
  })

  it('aborts the active request when stopped', () => {
    let requestSignal: AbortSignal | undefined
    const controller = new SyncController({
      fetch: (_rid, signal) => {
        requestSignal = signal
        return new Promise(() => undefined)
      },
      onData: vi.fn(),
      interval: () => 1_000,
    })

    controller.start()
    controller.stop()

    expect(requestSignal?.aborted).toBe(true)
  })

  it('does not deliver stale data after cancellation', async () => {
    let resolveRequest: ((value: { rid: number }) => void) | undefined
    const onData = vi.fn()
    const controller = new SyncController({
      fetch: () =>
        new Promise<{ rid: number }>((resolve) => {
          resolveRequest = resolve
        }),
      onData,
      interval: () => 1_000,
    })

    controller.start()
    controller.stop()
    resolveRequest?.({ rid: 1 })
    await Promise.resolve()

    expect(onData).not.toHaveBeenCalled()
  })

  it('synchronizes immediately when the network comes back', async () => {
    let online = false
    vi.spyOn(navigator, 'onLine', 'get').mockImplementation(() => online)
    const fetch = vi.fn().mockResolvedValue({ rid: 1 })
    const controller = new SyncController({
      fetch,
      onData: vi.fn(),
      interval: () => 1_000,
    })

    controller.start()
    expect(fetch).not.toHaveBeenCalled()
    online = true
    window.dispatchEvent(new Event('online'))
    await vi.advanceTimersByTimeAsync(0)

    expect(fetch).toHaveBeenCalledTimes(1)
    controller.stop()
  })
})
