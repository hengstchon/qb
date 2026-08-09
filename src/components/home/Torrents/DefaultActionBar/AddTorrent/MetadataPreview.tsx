import { FolderIcon, SaveIcon } from 'lucide-react'
import {
  buildTorrentFileTree,
  type TorrentFilePriority,
  type TorrentFileTreeNode,
  type TorrentMetadata,
} from '@/domain/torrentMetadata'
import { Button } from '@/ui/Button'
import { Checkbox } from '@/ui/Checkbox'
import { Label } from '@/ui/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/Select'
import { formatBytes } from '@/utils'

type MetadataPreviewProps = {
  metadata: TorrentMetadata
  priorities: TorrentFilePriority[]
  saving: boolean
  onPriorityChange: (index: number, priority: TorrentFilePriority) => void
  onSave: () => void
}

const priorityLabels: Record<Exclude<TorrentFilePriority, 0>, string> = {
  1: 'Normal',
  6: 'High',
  7: 'Maximum',
}

function FileTree({
  nodes,
  metadata,
  priorities,
  depth = 0,
  onPriorityChange,
}: {
  nodes: TorrentFileTreeNode[]
  metadata: TorrentMetadata
  priorities: TorrentFilePriority[]
  depth?: number
  onPriorityChange: (index: number, priority: TorrentFilePriority) => void
}) {
  return (
    <ul className="space-y-1" role={depth === 0 ? 'tree' : 'group'}>
      {nodes.map((node) => {
        const fileIndex = node.fileIndex
        const isFile = fileIndex !== undefined
        const priority = isFile ? priorities[fileIndex] : undefined
        return (
          <li key={node.path} role="treeitem">
            <div
              className="hover:bg-muted flex min-h-8 items-center gap-2 rounded px-2 py-1"
              style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
            >
              {isFile ? (
                <Checkbox
                  id={`metadata-file-${fileIndex}`}
                  aria-label={`Include ${node.path}`}
                  checked={priority !== 0}
                  onCheckedChange={(checked) =>
                    onPriorityChange(fileIndex, checked ? 1 : 0)
                  }
                />
              ) : (
                <FolderIcon className="text-muted-foreground h-4 w-4 shrink-0" />
              )}
              <Label
                htmlFor={isFile ? `metadata-file-${fileIndex}` : undefined}
                className="min-w-0 flex-1 truncate font-normal"
                title={node.path}
              >
                {node.name}
              </Label>
              {isFile && (
                <>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {formatBytes(metadata.info.files[fileIndex].length)}
                  </span>
                  <Select
                    value={String(priority === 0 ? 1 : priority)}
                    disabled={priority === 0}
                    onValueChange={(value) =>
                      onPriorityChange(
                        fileIndex,
                        Number(value) as TorrentFilePriority,
                      )
                    }
                  >
                    <SelectTrigger
                      className="h-7 w-28"
                      aria-label={`Priority for ${node.path}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
            {node.children.length > 0 && (
              <FileTree
                nodes={node.children}
                metadata={metadata}
                priorities={priorities}
                depth={depth + 1}
                onPriorityChange={onPriorityChange}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}

export function MetadataPreview({
  metadata,
  priorities,
  saving,
  onPriorityChange,
  onSave,
}: MetadataPreviewProps) {
  const includedSize = metadata.info.files.reduce(
    (total, file, index) => total + (priorities[index] === 0 ? 0 : file.length),
    0,
  )

  return (
    <section
      className="space-y-3 rounded-md border p-3"
      aria-label="Torrent metadata"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-medium" title={metadata.info.name}>
            {metadata.info.name}
          </h3>
          <p className="text-muted-foreground text-xs">
            {metadata.info.files.length} file(s) · {formatBytes(includedSize)}{' '}
            of {formatBytes(metadata.info.length)} selected
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={saving}
          onClick={onSave}
        >
          <SaveIcon className="mr-2 h-4 w-4" />
          {saving ? 'Saving…' : 'Save .torrent'}
        </Button>
      </div>
      <div className="max-h-60 overflow-auto rounded border p-1">
        <FileTree
          nodes={buildTorrentFileTree(metadata.info.files)}
          metadata={metadata}
          priorities={priorities}
          onPriorityChange={onPriorityChange}
        />
      </div>
    </section>
  )
}
