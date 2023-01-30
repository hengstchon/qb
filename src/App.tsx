import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { Button } from './ui/Button'
import axi from './utils/axi'

const App = () => {
  const { data } = useSWR('/app/version')
  console.log(data)

  return (
    <div className="">
      <div>App version: {data}</div>
      <Link to="/login">Login</Link>
      <br />
      <Button className="" onClick={() => axi.post('/auth/logout')}>
        Logout
      </Button>
    </div>
  )
}

export default App
