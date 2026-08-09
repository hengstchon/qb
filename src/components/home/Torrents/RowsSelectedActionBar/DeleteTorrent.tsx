import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useTorrentActions } from '@/hooks'
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
  const { deleteSelected } = useTorrentActions()

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
        <Button aria-label="Delete selected torrents" variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete the selected torrents from the
            transfer list?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex items-center gap-2">
            <Checkbox
              id="delete-files"
              checked={deleteFiles}
              onCheckedChange={() => setDeleteFiles((v) => !v)}
            />
            <Label htmlFor="delete-files">
              Also delete the files on the hard disk
            </Label>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleting}
            onClick={() => void handleDelete()}
          >
            {deleting ? 'Deleting…' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteTorrent
