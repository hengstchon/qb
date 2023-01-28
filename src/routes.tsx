import { createHashRouter } from 'react-router-dom'
import App from './App'
import { ErrorPage } from '@/pages/ErrorPage'
import { Login, action as loginAction } from '@/pages/Login'

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <Login />,
    action: loginAction,
  },
])
