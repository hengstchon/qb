import Toolbar from '@/components/Toolbar'
import Sidebar from '@/components/Sidebar'
import Torrents from '@/components/Torrents'

const MainPage = () => {
  return (
    <div className="flex h-screen flex-col">
      <Toolbar />
      <div className="flex h-[calc(100vh-3rem)] flex-1">
        <Sidebar />
        <Torrents />
      </div>
    </div>
  )
}

export default MainPage
