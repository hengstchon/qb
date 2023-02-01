import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { Button } from '@/ui/Button'
import Toolbar from '@/components/Toolbar'
import Sidebar from '@/components/Sidebar'
import Torrents from '@/components/Torrents'

const MainPage = () => {
  const { data } = useSWR('/app/version')
  console.log(data)

  return (
    <div className="flex min-h-screen flex-col">
      <Toolbar />
      <div className="flex flex-1">
        <Sidebar />
        <Torrents />
      </div>
    </div>
  )
}

export default MainPage
