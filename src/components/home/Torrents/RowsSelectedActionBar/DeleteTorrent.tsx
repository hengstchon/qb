import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { Trash2 } from 'lucide-react'
import { useTorrentActions } from '@/hooks'
import { batchActionPendingAtom } from '@/store'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/AlertDialog'
import { Button } from '@/ui/Button'
import { Checkbox } from '@/ui/Checkbox'
import { Label } from '@/ui/Label'

function DeleteTorrent() {
  const [deleteFiles, setDeleteFiles] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const pending = useAtomValue(batchActionPendingAtom)
  const { deleteSelected, getSelectedTorrents } = useTorrentActions()
  const selectedCount = getSelectedTorrents().length

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteSelected(deleteFiles)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          aria-label="Delete selected torrents"
          variant="ghost"
          size="sm"
          disabled={pending || selectedCount === 0}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove {selectedCount} selected torrent(s)?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <span className="block">
              Removing torrents from the transfer list does not delete their
              downloaded data unless the option below is checked.
            </span>
            <span className="flex items-center gap-2">
              <Checkbox
                id="delete-files"
                checked={deleteFiles}
                onCheckedChange={(checked) => setDeleteFiles(checked === true)}
              />
              <Label htmlFor="delete-files">
                Also permanently delete downloaded data from disk
              </Label>
            </span>
            {deleteFiles && (
              <strong className="text-destructive block">
                This permanently deletes data and cannot be undone.
              </strong>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleting || pending}
            onClick={() => void handleDelete()}
          >
            {deleting
              ? 'Deleting…'
              : deleteFiles
                ? 'Delete torrents and data'
                : 'Remove torrents only'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteTorrent
