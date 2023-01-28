import { Link } from 'react-router-dom'
import useSWR from 'swr'

const App = () => {
  const { data } = useSWR('/api/v2/app/version')
  console.log(data)

  return (
    <div className="">
      <div>App version: {data}</div>
      <Link to="/login">Login</Link>
    </div>
  )
}

export default App
