import { useEffect, useState } from 'react'
import { ActionFunction, Navigate, useActionData } from 'react-router-dom'
import { useAtom } from 'jotai'
import { Loader2 } from 'lucide-react'
import { Button } from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Label } from '@/ui/Label'
import { isAuthedAtom } from '@/routes/Auth'
import { API } from '@/api/endpoints'
import client from '@/api/client'

type PayloadType = {
  username: string
  password: string
}

const login = (payload: PayloadType) => {
  const { username, password } = payload
  return client
    .url(API.login)
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    })
    .post(`username=${username}&password=${password}`)
    .res((res) => res)
}

export const Login = () => {
  const [isAuthed, setIsAuthed] = useAtom(isAuthedAtom)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const err = useActionData() as string | undefined
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    err && setIsLoading(false)
  }, [err, isLoading])

  const handleSubmit = async () => {
    setIsLoading(true)
    const payload = {
      username,
      password,
    }
    const res = await login(payload)

    setIsLoading(false)
    if (res.status == 200) {
      const resText = await res.text()

      if (resText == 'Ok.') {
        setIsAuthed(true)
      }
    }
  }

  return isAuthed ? (
    <Navigate to="/" />
  ) : (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-md flex-col">
        <h1 className="text-center text-3xl font-semibold">Welcome</h1>
        <div className="mb-16 mt-6 grid gap-6 rounded-md border px-16 py-8">
          <div className="grid gap-2">
            <Label className="text-base leading-none" htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-base leading-none" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full space-y-2 text-center">
            <p className="h-6 text-red-400">{err}</p>
            <Button
              className="w-full bg-blue-200 px-12 py-2"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <Loader2 className="mx-auto h-6 w-6 animate-spin" />
              ) : (
                'Sign in'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
