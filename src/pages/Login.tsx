import { Button } from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Label } from '@/ui/Label'
import { ActionFunction, Form, redirect } from 'react-router-dom'
import axios, { AxiosRequestConfig } from 'axios'

export const Login = () => {
  return (
    <Form method="post">
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
            <div className="mt-2 w-full text-center">
              <Button className="bg-blue-200 px-12 py-2">Sign in</Button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  )
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  let data = Object.fromEntries(formData)
  data = { username: 'aadmin', password: 'VVwZvHyc6LdY65' }

  const options = {
    method: 'POST',
    url: '/api/v2/auth/login',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  }
  const res = await axios.request(options)
  console.log(res)
  if (res.status == 200) {
    if (res.data == 'Ok.') {
      return redirect('/')
    } else {
      return 'Wrong username or password!'
    }
  } else {
    return 'Error!'
  }
}
