import { useState } from 'react'
import { Trash2 } from 'lucide-react'
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

  function handleDelete() {
    console.log('deleteFiles:', deleteFiles)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 />
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
          <AlertDialogAction onClick={handleDelete}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteTorrent
