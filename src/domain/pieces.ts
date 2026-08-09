export type PieceState = 0 | 1 | 2

export const normalizePieceStates = (value: unknown): PieceState[] =>
  Array.isArray(value)
    ? value.map((state) => (state === 1 || state === 2 ? state : 0))
    : []

export const normalizePieceAvailability = (value: unknown): number[] =>
  Array.isArray(value)
    ? value.map((count) =>
        typeof count === 'number' && Number.isFinite(count) && count > 0
          ? count
          : 0,
      )
    : []

export const summarizePieces = (
  states: PieceState[],
  availability: number[],
) => ({
  missing: states.filter((state) => state === 0).length,
  downloading: states.filter((state) => state === 1).length,
  downloaded: states.filter((state) => state === 2).length,
  maxAvailability: Math.max(0, ...availability),
})

export const pieceAvailabilityKey = <Request>(
  request: Request,
  supported: boolean,
) => (supported ? request : null)
