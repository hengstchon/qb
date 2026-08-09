import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { Gauge } from 'lucide-react'
import type { ShareLimitAction } from '@/domain/batchActions'
import { useTorrentActions } from '@/hooks'
import { setTorrentLimits } from '@/services'
import { batchActionPendingAtom } from '@/store'
import { Button } from '@/ui/Button'
import { Checkbox } from '@/ui/Checkbox'
import { Input } from '@/ui/Input'
import { Label } from '@/ui/Label'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/Select'

const optionalNumber = (value: string) =>
  value.trim() === '' ? undefined : Number(value)

export default function SetLimits() {
  const [uploadLimit, setUploadLimit] = useState('')
  const [downloadLimit, setDownloadLimit] = useState('')
  const [ratioLimit, setRatioLimit] = useState('')
  const [seedingTimeLimit, setSeedingTimeLimit] = useState('')
  const [inactiveSeedingTimeLimit, setInactiveSeedingTimeLimit] = useState('')
  const [shareLimitAction, setShareLimitAction] = useState<
    ShareLimitAction | ''
  >('')
  const [destructiveConfirmed, setDestructiveConfirmed] = useState(false)
  const pending = useAtomValue(batchActionPendingAtom)
  const { capabilities, runSelected } = useTorrentActions()
  const destructive =
    shareLimitAction === 'Remove' || shareLimitAction === 'RemoveWithContent'
  const values = [
    uploadLimit,
    downloadLimit,
    ratioLimit,
    seedingTimeLimit,
    inactiveSeedingTimeLimit,
  ]
  const invalid = values.some(
    (value) => value.trim() !== '' && !Number.isFinite(Number(value)),
  )
  const hasChanges =
    values.some((value) => value.trim() !== '') || shareLimitAction !== ''

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Set torrent limits"
          variant="ghost"
          size="sm"
          disabled={pending}
        >
          <Gauge className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 space-y-3">
        <p className="text-sm font-medium">Limits</p>
        <div className="grid grid-cols-2 items-center gap-2">
          <Label htmlFor="upload-rate">Upload rate (B/s)</Label>
          <Input
            id="upload-rate"
            type="number"
            value={uploadLimit}
            placeholder="No change"
            onChange={(event) => setUploadLimit(event.target.value)}
          />
          <Label htmlFor="download-rate">Download rate (B/s)</Label>
          <Input
            id="download-rate"
            type="number"
            value={downloadLimit}
            placeholder="No change"
            onChange={(event) => setDownloadLimit(event.target.value)}
          />
          <Label htmlFor="share-ratio">Share ratio</Label>
          <Input
            id="share-ratio"
            type="number"
            step="0.1"
            value={ratioLimit}
            placeholder="No change"
            onChange={(event) => setRatioLimit(event.target.value)}
          />
          <Label htmlFor="seeding-time">Seeding time (minutes)</Label>
          <Input
            id="seeding-time"
            type="number"
            value={seedingTimeLimit}
            placeholder="No change"
            onChange={(event) => setSeedingTimeLimit(event.target.value)}
          />
          {capabilities.supportsShareLimitAction && (
            <>
              <Label htmlFor="inactive-seeding-time">
                Inactive seeding (minutes)
              </Label>
              <Input
                id="inactive-seeding-time"
                type="number"
                value={inactiveSeedingTimeLimit}
                placeholder="No change"
                onChange={(event) =>
                  setInactiveSeedingTimeLimit(event.target.value)
                }
              />
              <Label htmlFor="share-limit-action">Limit action</Label>
              <Select
                value={shareLimitAction}
                onValueChange={(value) => {
                  setShareLimitAction(value as ShareLimitAction)
                  setDestructiveConfirmed(false)
                }}
              >
                <SelectTrigger id="share-limit-action">
                  <SelectValue placeholder="No change" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default">Use default</SelectItem>
                  <SelectItem value="Stop">Stop torrent</SelectItem>
                  <SelectItem value="Remove">Remove torrent</SelectItem>
                  <SelectItem value="RemoveWithContent">
                    Remove torrent and data
                  </SelectItem>
                  <SelectItem value="EnableSuperSeeding">
                    Enable super seeding
                  </SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        {destructive && (
          <div className="border-destructive text-destructive space-y-2 rounded border p-2 text-sm">
            <p>
              {shareLimitAction === 'RemoveWithContent'
                ? 'When a share limit is reached, qBittorrent will remove the torrent and permanently delete its data.'
                : 'When a share limit is reached, qBittorrent will remove the torrent from the transfer list.'}
            </p>
            <div className="flex items-center gap-2">
              <Checkbox
                id="confirm-share-action"
                checked={destructiveConfirmed}
                onCheckedChange={(checked) =>
                  setDestructiveConfirmed(checked === true)
                }
              />
              <Label htmlFor="confirm-share-action">
                I understand this destructive action
              </Label>
            </div>
          </div>
        )}
        <Button
          variant="secondary"
          size="sm"
          disabled={
            pending ||
            invalid ||
            !hasChanges ||
            (destructive && !destructiveConfirmed)
          }
          onClick={() =>
            void runSelected('Set limits', (hashes) =>
              setTorrentLimits(
                hashes,
                {
                  uploadLimit: optionalNumber(uploadLimit),
                  downloadLimit: optionalNumber(downloadLimit),
                  ratioLimit: optionalNumber(ratioLimit),
                  seedingTimeLimit: optionalNumber(seedingTimeLimit),
                  inactiveSeedingTimeLimit: optionalNumber(
                    inactiveSeedingTimeLimit,
                  ),
                  shareLimitAction: capabilities.supportsShareLimitAction
                    ? shareLimitAction || undefined
                    : undefined,
                },
                capabilities,
              ),
            )
          }
        >
          Apply limits
        </Button>
      </PopoverContent>
    </Popover>
  )
}
