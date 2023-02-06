import { API } from '@/utils/api'
import { atom, useAtom } from 'jotai'
import useSWR from 'swr'

const ridAtom = atom(0)

const Test = () => {
  const [rid, setRid] = useAtom(ridAtom)
  const { data } = useSWR(API.syncMain(rid), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    // onSuccess: (data) => {
    //   setTimeout(() => {
    //     setRid(data.rid)
    //   }, 3000)
    // },
    fallbackData: {},
  })
  console.log(rid)
  console.log(data)

  return (
    <div className="h-screen overflow-auto bg-slate-700 p-8 text-slate-200">
      <div>{Math.random()}</div>
      <div>
        {Object.keys(data).map((k, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">
            <span>{k}:</span>
            <span className="ml-4">{JSON.stringify(data[k])}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Test
