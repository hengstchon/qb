import { useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import { ChevronsDownIcon, ChevronsUpIcon } from 'lucide-react'
import { settingsAtom } from '@/store'
import { Button } from '@/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/Tabs'
import { cn } from '@/utils'
import Content from './File'
import General from './General'
import HTTPSources from './HTTPSource'
import Peers from './Peer'
import Trackers from './Tracker'

const openDetailsAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop('openDetails'),
)

const tabs = [
  { name: 'General', content: <General /> },
  { name: 'Trackers', content: <Trackers /> },
  { name: 'Peers', content: <Peers /> },
  { name: 'HTTP Sources', content: <HTTPSources /> },
  { name: 'Content', content: <Content /> },
]

const Details = () => {
  const [openDetails, setOpenDetails] = useAtom(openDetailsAtom)

  return (
    <Tabs
      className={cn('flex flex-col px-4', openDetails && 'h-96')}
      defaultValue={tabs[2].name}
    >
      <TabsList className="flex justify-between rounded-b-none">
        <div>
          {tabs.map(({ name }) => (
            <TabsTrigger key={name} value={name}>
              {name}
            </TabsTrigger>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpenDetails((v) => !v)}
        >
          {openDetails ? <ChevronsDownIcon /> : <ChevronsUpIcon />}
        </Button>
      </TabsList>

      {openDetails &&
        tabs.map(({ name, content }) => (
          <TabsContent
            key={name}
            value={name}
            className="mt-0 flex-1 overflow-auto border-l border-r px-2"
          >
            {content}
          </TabsContent>
        ))}
    </Tabs>
  )
}

export default Details
