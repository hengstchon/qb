export type IncrementalPayload = {
  rid: number
  full_update?: boolean
}

type SyncControllerOptions<T extends IncrementalPayload> = {
  fetch: (rid: number, signal: AbortSignal) => Promise<T>
  onData: (data: T) => void
  onError?: (error: unknown) => void
  interval: () => number
  maxBackoffMs?: number
  hiddenIntervalMs?: number
}

export class SyncController<T extends IncrementalPayload> {
  private rid = 0
  private timer: ReturnType<typeof setTimeout> | null = null
  private request: AbortController | null = null
  private stopped = true
  private failures = 0

  constructor(private readonly options: SyncControllerOptions<T>) {}

  start() {
    if (!this.stopped) return
    this.stopped = false
    document.addEventListener('visibilitychange', this.handleVisibility)
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)
    this.syncNow()
  }

  stop() {
    if (this.stopped) return
    this.stopped = true
    this.clearTimer()
    this.request?.abort()
    this.request = null
    document.removeEventListener('visibilitychange', this.handleVisibility)
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
  }

  reset() {
    this.rid = 0
    this.failures = 0
    this.syncNow()
  }

  private clearTimer() {
    if (this.timer !== null) clearTimeout(this.timer)
    this.timer = null
  }

  private schedule(delayMs: number) {
    if (this.stopped) return
    this.clearTimer()
    this.timer = setTimeout(() => this.run(), Math.max(0, delayMs))
  }

  private syncNow() {
    if (this.stopped) return
    this.clearTimer()
    this.request?.abort()
    this.request = null
    if (!navigator.onLine) return
    if (document.hidden) {
      this.schedule(this.options.hiddenIntervalMs ?? 60_000)
      return
    }
    void this.run()
  }

  private async run() {
    if (this.stopped || this.request || !navigator.onLine) return
    if (document.hidden) {
      this.schedule(this.options.hiddenIntervalMs ?? 60_000)
      return
    }

    const request = new AbortController()
    this.request = request
    try {
      const data = await this.options.fetch(this.rid, request.signal)
      if (this.stopped || request.signal.aborted || this.request !== request)
        return
      this.rid = data.rid
      this.failures = 0
      this.options.onData(data)
      this.schedule(this.options.interval())
    } catch (error) {
      if (this.stopped || request.signal.aborted) return
      this.failures += 1
      this.options.onError?.(error)
      const backoff = Math.min(
        this.options.interval() * 2 ** (this.failures - 1),
        this.options.maxBackoffMs ?? 60_000,
      )
      this.schedule(backoff)
    } finally {
      if (this.request === request) this.request = null
    }
  }

  private handleVisibility = () => {
    if (document.hidden) {
      this.request?.abort()
      this.request = null
      this.schedule(this.options.hiddenIntervalMs ?? 60_000)
    } else {
      this.syncNow()
    }
  }

  private handleOnline = () => this.syncNow()

  private handleOffline = () => {
    this.clearTimer()
    this.request?.abort()
    this.request = null
  }
}
