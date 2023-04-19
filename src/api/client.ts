import { store } from '@/App'
import { isAuthedAtom } from '@/routes/Auth'
import axios, { AxiosResponse } from 'axios'

const client = axios.create({
  baseURL: '/api/v2',
  timeout: 6000,
})

client.interceptors.response.use(
  (res: AxiosResponse) => {
    return res
  }
  // (err) => {
  //   console.log('axios err: ', err)
  //   // let msg = ''
  //   // switch (err.response?.status) {
  //   //   case 403:
  //   //     msg = '未登录(403)'
  //   //     store.set(isAuthedAtom, false)
  //   //     break
  //   //   default:
  //   //     msg = `连接出错(${err.response?.status})`
  //   // }
  //   // console.log(msg)
  //   return Promise.reject(err)
  // }
)

export default client
