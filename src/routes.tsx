import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { ErrorPage } from './pages/ErrorPage'
import { Login } from './pages/Login'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
])
