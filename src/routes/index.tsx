import { createHashRouter } from 'react-router-dom'
import { ErrorPage } from './ErrorPage'
import { Login, action as loginAction } from './Login'
import Auth from './Auth'
import Test from './Test'
import HomePage from '@/components/Homepage'

export const router = createHashRouter([
  {
    path: '/login',
    element: <Login />,
    action: loginAction,
  },
  {
    path: '/test',
    element: <Test />,
  },
  {
    path: '/',
    element: <Auth />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
    ],
  },
  {
    path: '/*',
    element: <ErrorPage />,
  },
])
