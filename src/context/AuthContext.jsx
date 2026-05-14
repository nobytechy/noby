import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Hardcoded admin email — must match the address used in supabase/schema.sql
// RLS policies. The user-facing auth UX is PIN-only; this email is invisible
// to admins and never displayed.
export const ADMIN_EMAIL = 'aizim1900@gmail.com'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
    })
    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [])

  const signIn = (pin) =>
    supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: pin })

  const signOut = () => supabase.auth.signOut()

  const changePin = async (currentPin, newPin) => {
    const { error: verifyErr } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: currentPin,
    })
    if (verifyErr) return { error: { message: 'Current PIN is incorrect' } }

    const { error: updateErr } = await supabase.auth.updateUser({ password: newPin })
    if (updateErr) return { error: updateErr }

    return { error: null }
  }

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signIn,
    signOut,
    changePin,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
