import { useEffect, useState } from 'react'
import { ActionFunction, Form, Navigate, useActionData } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { Loader2 } from 'lucide-react'
import { Button } from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Label } from '@/ui/Label'
import axi from '@/utils/axi'
import { store } from '@/App'
import { isAuthedAtom } from './Auth'

export const Login = () => {
  const isAuthed = useAtomValue(isAuthedAtom)

  const err = useActionData() as string | undefined
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    err && setIsLoading(false)
  }, [err, isLoading])

  return isAuthed ? (
    <Navigate to="/" />
  ) : (
    <Form
      method="post"
      onSubmit={() => {
        setIsLoading(true)
      }}
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex w-full max-w-md flex-col">
          <h1 className="text-center text-3xl font-semibold">Welcome</h1>
          <div className="mt-6 mb-16 grid gap-6 rounded-md border px-16 py-8">
            <div className="grid gap-2">
              <Label className="text-base leading-none" htmlFor="username">
                Username
              </Label>
              <Input id="username" name="username" />
            </div>
            <div className="grid gap-2">
              <Label className="text-base leading-none" htmlFor="password">
                Password
              </Label>
              <Input id="password" name="password" />
            </div>
            <div className="w-full space-y-2 text-center">
              <p className="h-6 text-red-400">{err}</p>
              <Button className="w-full bg-blue-200 px-12 py-2">
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
    </Form>
  )
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const res = await axi.post('/auth/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  if (res.status == 200) {
    if (res.data == 'Ok.') {
      store.set(isAuthedAtom, true)
      return null
    } else {
      return 'Invalid Username or Password!'
    }
  } else {
    return 'Unknown Error!'
  }
}
