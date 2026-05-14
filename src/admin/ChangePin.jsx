import { useState } from 'react'
import toast from 'react-hot-toast'
import { KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/context/AuthContext'

const PIN_MIN = 4
const PIN_MAX = 12

export default function ChangePin() {
  const { changePin } = useAuth()
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onlyDigits = (val, max = PIN_MAX) => val.replace(/\D/g, '').slice(0, max)

  const reset = () => {
    setCurrentPin('')
    setNewPin('')
    setConfirmPin('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (newPin.length < PIN_MIN) {
      toast.error(`New PIN must be at least ${PIN_MIN} digits`)
      return
    }
    if (newPin !== confirmPin) {
      toast.error('New PIN and confirmation do not match')
      return
    }
    if (newPin === currentPin) {
      toast.error('New PIN must be different from current PIN')
      return
    }

    setSubmitting(true)
    const { error } = await changePin(currentPin, newPin)
    setSubmitting(false)

    if (error) {
      toast.error(error.message || 'Could not change PIN')
      return
    }
    toast.success('PIN updated')
    reset()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Security</h1>
      <p className="text-muted-foreground mt-1">Change the PIN used to sign in to the admin panel.</p>

      <div className="mt-8 max-w-md">
        <Card>
          <CardHeader>
            <div className="size-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-2">
              <KeyRound size={18} />
            </div>
            <CardTitle>Change PIN</CardTitle>
            <CardDescription>{PIN_MIN}–{PIN_MAX} digits, numbers only.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="current-pin">Current PIN</Label>
                <Input
                  id="current-pin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="current-password"
                  pattern="\d*"
                  minLength={PIN_MIN}
                  maxLength={PIN_MAX}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(onlyDigits(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-pin">New PIN</Label>
                <Input
                  id="new-pin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="new-password"
                  pattern="\d*"
                  minLength={PIN_MIN}
                  maxLength={PIN_MAX}
                  value={newPin}
                  onChange={(e) => setNewPin(onlyDigits(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-pin">Confirm new PIN</Label>
                <Input
                  id="confirm-pin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="new-password"
                  pattern="\d*"
                  minLength={PIN_MIN}
                  maxLength={PIN_MAX}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(onlyDigits(e.target.value))}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={submitting || !currentPin || !newPin || !confirmPin}
              >
                {submitting ? 'Updating…' : 'Update PIN'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
