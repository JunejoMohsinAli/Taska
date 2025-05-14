import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import { toast } from 'react-toastify'

export default function Confirm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyEmail = async () => {
      // Grab the access_token from the URL if present
      const accessToken = searchParams.get('access_token')

      if (accessToken) {
        // Set the session in Supabase client
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: '' })
      }

      // Now check session to see if user is confirmed
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        toast.error('Email confirmation failed or expired.')
        navigate('/signup')
      } else {
        toast.success('Email confirmed! You can now log in.')
        navigate('/login')
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Processing email confirmation…</p>
    </div>
  )
}
