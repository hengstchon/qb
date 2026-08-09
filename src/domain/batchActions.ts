export type ShareLimitAction =
  'Default' | 'Stop' | 'Remove' | 'RemoveWithContent' | 'EnableSuperSeeding'

export type BatchActionFailure = {
  hash: string
  message: string
}

export type BatchActionResult = {
  succeeded: string[]
  failed: BatchActionFailure[]
}

export type BatchActionFeedback = BatchActionResult & {
  action: string
}

export const batchActionMessage = (feedback: BatchActionFeedback) => {
  if (feedback.failed.length === 0) {
    return `${feedback.action}: ${feedback.succeeded.length} succeeded.`
  }
  return `${feedback.action}: ${feedback.succeeded.length} succeeded, ${feedback.failed.length} failed.`
}
