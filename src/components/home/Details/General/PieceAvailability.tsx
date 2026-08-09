import { useEffect, useRef } from 'react'
import { summarizePieces, type PieceState } from '@/domain/pieces'

const colors: Record<PieceState, string> = {
  0: '#94a3b8',
  1: '#f59e0b',
  2: '#22c55e',
}

export function PieceAvailability({
  states,
  availability,
}: {
  states: PieceState[]
  availability?: number[]
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const summary = summarizePieces(states, availability ?? [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context || states.length === 0) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    const availabilityHeight = availability?.length ? 12 : 0
    for (let x = 0; x < canvas.width; x += 1) {
      const pieceIndex = Math.min(
        states.length - 1,
        Math.floor((x / canvas.width) * states.length),
      )
      const state = states[pieceIndex]
      context.fillStyle = colors[state]
      context.fillRect(
        x,
        availabilityHeight,
        1,
        canvas.height - availabilityHeight,
      )

      if (availabilityHeight) {
        const count = availability?.[pieceIndex] ?? 0
        const intensity = summary.maxAvailability
          ? Math.max(0.12, count / summary.maxAvailability)
          : 0.08
        context.fillStyle = `rgba(37, 99, 235, ${intensity})`
        context.fillRect(x, 0, 1, availabilityHeight)
      }
    }
  }, [availability, states, summary.maxAvailability])

  if (states.length === 0) return null

  return (
    <section className="space-y-2" aria-label="Piece map">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold">Pieces</h2>
        <span className="text-muted-foreground text-xs">
          {states.length.toLocaleString()} pieces
          {availability?.length
            ? ` · up to ${summary.maxAvailability} peer(s) available`
            : ''}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={1200}
        height={36}
        className="h-9 w-full rounded border"
        role="img"
        aria-label={`${summary.downloaded} downloaded, ${summary.downloading} downloading, ${summary.missing} missing pieces${availability?.length ? `; maximum availability ${summary.maxAvailability}` : ''}`}
      />
      <div className="text-muted-foreground flex flex-wrap gap-4 text-xs">
        {Object.entries({
          Missing: colors[0],
          Downloading: colors[1],
          Downloaded: colors[2],
        }).map(([label, color]) => (
          <span key={label} className="flex items-center gap-1">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: color }}
            />
            {label}
          </span>
        ))}
        {availability?.length ? (
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-600" />
            Availability (top band)
          </span>
        ) : null}
      </div>
    </section>
  )
}
