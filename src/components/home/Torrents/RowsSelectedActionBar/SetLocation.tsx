import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { MapPin } from 'lucide-react'
import { useTorrentActions } from '@/hooks'
import { setTorrentLocation } from '@/services'
import { batchActionPendingAtom } from '@/store'
import { Button } from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Label } from '@/ui/Label'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover'

export default function SetLocation() {
  const [location, setLocation] = useState('')
  const pending = useAtomValue(batchActionPendingAtom)
  const { runSelected } = useTorrentActions()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Set torrent location"
          variant="ghost"
          size="sm"
          disabled={pending}
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Label htmlFor="set-location">Location:</Label>
        <Input
          id="set-location"
          className="mt-1"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
        <Button
          variant="secondary"
          size="sm"
          className="mt-2"
          disabled={pending || !location.trim()}
          onClick={() =>
            void runSelected('Set location', (hashes) =>
              setTorrentLocation(hashes, location.trim()),
            )
          }
        >
          Move torrents
        </Button>
      </PopoverContent>
    </Popover>
  )
}
