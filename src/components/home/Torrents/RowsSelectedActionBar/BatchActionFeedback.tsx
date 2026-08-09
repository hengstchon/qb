import { useAtomValue, useSetAtom } from 'jotai'
import { XIcon } from 'lucide-react'
import { batchActionMessage } from '@/domain/batchActions'
import { batchActionFeedbackAtom } from '@/store'
import { Button } from '@/ui/Button'

export default function BatchActionFeedback() {
  const feedback = useAtomValue(batchActionFeedbackAtom)
  const setFeedback = useSetAtom(batchActionFeedbackAtom)
  if (!feedback) return null

  return (
    <div
      role={feedback.failed.length ? 'alert' : 'status'}
      className="flex max-w-full items-start gap-2 rounded border px-2 py-1 text-xs"
    >
      <div className="min-w-0 flex-1">
        <p>{batchActionMessage(feedback)}</p>
        {feedback.failed.length > 0 && (
          <ul className="text-destructive max-h-20 overflow-auto">
            {feedback.failed.map(({ hash, message }) => (
              <li key={hash}>
                {hash}: {message}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0"
        aria-label="Dismiss batch action result"
        onClick={() => setFeedback(null)}
      >
        <XIcon className="h-3 w-3" />
      </Button>
    </div>
  )
}
