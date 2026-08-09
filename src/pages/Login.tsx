import { KeyboardEvent, useState } from 'react'
import { useAtomValue } from 'jotai'
import { useAuth } from '@/hooks/useAuth'
import { authErrorAtom } from '@/store'
import { Button } from '@/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ui/card'
import { Input } from '@/ui/Input'
import { Label } from '@/ui/Label'

const Login = () => {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const authError = useAtomValue(authErrorAtom)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    await login({ username, password })
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              required
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-2">
            {authError && (
              <p role="alert" className="text-sm text-destructive">
                {authError}
              </p>
            )}
            <Button className="w-full" onClick={handleSubmit}>
              Sign in
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
