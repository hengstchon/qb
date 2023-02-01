import { API } from '@/utils/api'
import useSWR from 'swr'

const Torrents = () => {
  const { data, isLoading } = useSWR(API.torrentInfo())
  if (isLoading) return <div>Loading...</div>
  console.log('data: ', data)

  return (
    <div className="min-w-0 flex-1 bg-yellow-50">
      Torrents
      <Log tors={data} />
    </div>
  )
}

const Log = ({ tors }) => {
  return (
    <div>
      {tors.map((t, i) => (
        <div key={i}>
          <span>-------------------------------</span>
          <div key={i} className="mb-4">
            {Object.keys(t).map((k, i) => (
              <pre key={i} className="mb-1 whitespace-pre-wrap break-words">
                <span>{k}:</span>
                <span className="ml-4">{t[k]}</span>
              </pre>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Torrents
