import { Button } from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Label } from '@/ui/Label'

export const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-md flex-col">
        <h1 className="text-center text-3xl font-semibold">Welcome</h1>
        <div className="mt-6 mb-16 grid gap-6 rounded-md border px-16 py-8">
          <div className="grid gap-2">
            <Label className="text-base leading-none" htmlFor="username">
              Username
            </Label>
            <Input id="username" />
          </div>
          <div className="grid gap-2">
            <Label className="text-base leading-none" htmlFor="password">
              Password
            </Label>
            <Input id="password" />
          </div>
          <div className="mx-auto mt-2">
            <Button className="bg-blue-200 px-12 py-2">Sign in</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
