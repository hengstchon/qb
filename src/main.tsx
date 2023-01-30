import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { SWRConfig, SWRConfiguration } from 'swr'
import axi from '@/utils/axi'

const swrConfig: SWRConfiguration = {
  fetcher: (url) => axi.get(url).then((res) => res.data),
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SWRConfig value={swrConfig}>
      <RouterProvider router={router} />
    </SWRConfig>
  </React.StrictMode>
)
