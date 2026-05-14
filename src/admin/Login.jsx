import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Lock } from 'lucide-react'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/context/AuthContext'

const PIN_MIN = 4
const PIN_MAX = 12

export default function Login() {
  const { session, signIn, loading } = useAuth()
  const [pin, setPin] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()
  const from = loc.state?.from?.pathname || '/admin'

  if (!loading && session) return <Navigate to={from} replace />

  const handlePinChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, PIN_MAX)
    setPin(digitsOnly)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (pin.length < PIN_MIN) {
      toast.error(`PIN must be at least ${PIN_MIN} digits`)
      return
    }
    setSubmitting(true)
    const { error } = await signIn(pin)
    setSubmitting(false)
    if (error) {
      toast.error('Incorrect PIN')
      setPin('')
    } else {
      toast.success('Welcome back')
      nav(from, { replace: true })
    }
  }

  return (
    <>
      <SEO title="Admin Login" path="/admin/login" />
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="size-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-2">
              <Lock size={18} />
            </div>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your PIN to manage your portfolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="current-password"
                  pattern="\d*"
                  minLength={PIN_MIN}
                  maxLength={PIN_MAX}
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="••••••••"
                  autoFocus
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting || pin.length < PIN_MIN}>
                {submitting ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
