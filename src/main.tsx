import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { SWRConfig, SWRConfiguration } from 'swr'
import axios from 'axios'

const swrConfig: SWRConfiguration = {
  fetcher: (url) => axios.get(url).then((res) => res.data),
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SWRConfig value={swrConfig}>
      <RouterProvider router={router} />
    </SWRConfig>
  </React.StrictMode>
)
