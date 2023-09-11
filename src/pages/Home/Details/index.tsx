import { useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import { ChevronsDownIcon, ChevronsUpIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/Tabs'
import { settingsAtom } from '../atoms'
import Content from './Content'
import General from './General'
import HTTPSources from './HTTPSources'
import Peers from './Peers'
import Trackers from './Trackers'

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
      className={cn('flex flex-col', openDetails && 'h-96')}
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
            className="flex-1 overflow-auto px-2"
          >
            {content}
          </TabsContent>
        ))}
    </Tabs>
  )
}

export default Details
