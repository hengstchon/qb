import { RouterProvider } from 'react-router-dom'
import { SWRConfig, SWRConfiguration } from 'swr'
import { createStore, Provider } from 'jotai'
import { router } from './routes'
import './index.css'
import apiClient from './utils/apiClient'

const swrConfig: SWRConfiguration = {
  fetcher: (url) => apiClient.get(url).then((res) => res.data),
}

export const store = createStore()

const App = () => {
  return (
    <SWRConfig value={swrConfig}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </SWRConfig>
  )
}

export default App
