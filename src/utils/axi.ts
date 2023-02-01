import { store } from '@/App'
import { isAuthedAtom } from '@/routes/Auth'
import axios, { AxiosResponse } from 'axios'

const axi = axios.create({
  baseURL: '/api/v2',
  timeout: 6000,
})

axi.interceptors.response.use(
  (res: AxiosResponse) => {
    return res
  },
  (err) => {
    let msg = ''
    switch (err.response.status) {
      case 403:
        msg = '未登录(403)'
        store.set(isAuthedAtom, false)
        break
      default:
        msg = `连接出错(${err.response.status})`
    }
    // console.log(msg)
    return Promise.reject(err.response)
  }
)

export default axi
