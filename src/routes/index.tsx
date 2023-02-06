import { createHashRouter } from 'react-router-dom'
import MainPage from './Main'
import { ErrorPage } from './ErrorPage'
import { Login, action as loginAction } from './Login'
import Auth from './Auth'
import Test from './Test'

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
        element: <MainPage />,
      },
    ],
  },
  {
    path: '/*',
    element: <ErrorPage />,
  },
])
