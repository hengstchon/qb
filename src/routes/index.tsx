import { createHashRouter } from 'react-router-dom'
import MainPage from './Main'
import { ErrorPage } from './ErrorPage'
import { Login, action as loginAction } from './Login'
import Auth from './Auth'

export const router = createHashRouter([
  {
    path: '/login',
    element: <Login />,
    action: loginAction,
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
