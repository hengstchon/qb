import {
  Route,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import { ErrorPage } from '@/pages/ErrorPage'
import Home from '@/pages/Home'
import { Login } from '@/pages/Login'
import Auth from './Auth'

export const router = createHashRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Auth />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Route>
  )
)

const Test = () => {
  return (
    <div className="h-screen overflow-auto bg-slate-700 p-8 text-slate-200">
      <div>{Math.random()}</div>
    </div>
  )
}
