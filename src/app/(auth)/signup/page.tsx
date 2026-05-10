'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { MinaAvatar } from '@/components/mina/MinaAvatar'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!agreed) { setError('Please accept the terms to continue.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }

    setLoading(true)
    setError('')

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: `${firstName} ${lastName}`.trim() },
        emailRedirectTo: `${window.location.origin}/setup`,
      },
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    // Store name and onboarding data from localStorage if it exists
    const onboarding = localStorage.getItem('mina_onboarding')
    if (onboarding) {
      localStorage.setItem('mina_pending_setup', onboarding)
    }

    router.push('/setup')
  }

  return (
    <div className="animate-fade-up">
      {/* Mina intro */}
      <div
        className="rounded-2xl p-5 mb-6 relative overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--gold-b)' }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, var(--gold), var(--teal), transparent)' }}
        />
        <div className="flex gap-3 items-start">
          <MinaAvatar size="sm" />
          <div>
            <div className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--gold)' }}>
              MINA
            </div>
            <p className="font-heading italic text-sm leading-relaxed" style={{ color: 'var(--soft)' }}>
              I am preparing your personalized plan. Create your account so your progress and next steps stay saved.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div
        className="rounded-2xl p-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--bord)' }}
      >
        <h1
          className="font-heading text-2xl italic font-bold mb-1"
          style={{ color: 'var(--white)' }}
        >
          Create your account.
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--dim)' }}>
          Free to start. No credit card required.
        </p>

        {error && (
          <div
            className="rounded-lg px-4 py-3 text-sm mb-4"
            style={{ background: 'var(--red-dim)', border: '1px solid var(--red-b)', color: 'var(--red)' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-3">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold tracking-wider uppercase mb-1.5" style={{ color: 'var(--muted)' }}>
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First"
                required
                autoComplete="given-name"
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
                style={{
                  background: 'var(--surface2)',
                  border: '1.5px solid var(--bord)',
                  color: 'var(--white)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--teal-b)')}
                onBlur={e => (e.target.style.borderColor = 'var(--bord)')}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-wider uppercase mb-1.5" style={{ color: 'var(--muted)' }}>
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last"
                required
                autoComplete="family-name"
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
                style={{
                  background: 'var(--surface2)',
                  border: '1.5px solid var(--bord)',
                  color: 'var(--white)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--teal-b)')}
                onBlur={e => (e.target.style.borderColor = 'var(--bord)')}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold tracking-wider uppercase mb-1.5" style={{ color: 'var(--muted)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              autoComplete="email"
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
              style={{
                background: 'var(--surface2)',
                border: '1.5px solid var(--bord)',
                color: 'var(--white)',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--teal-b)')}
              onBlur={e => (e.target.style.borderColor = 'var(--bord)')}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold tracking-wider uppercase mb-1.5" style={{ color: 'var(--muted)' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                autoComplete="new-password"
                className="w-full rounded-lg px-3 py-2.5 pr-10 text-sm outline-none transition-colors"
                style={{
                  background: 'var(--surface2)',
                  border: '1.5px solid var(--bord)',
                  color: 'var(--white)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--teal-b)')}
                onBlur={e => (e.target.style.borderColor = 'var(--bord)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: 'var(--dim)' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-b)' }}
          >
            <p className="text-[10px] font-bold tracking-wider uppercase mb-2" style={{ color: 'var(--gold)' }}>
              Important
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--muted)' }}>
              Mina provides educational financial guidance only — not legal, financial, or tax advice. For complex legal matters, consulting a licensed professional is recommended.
            </p>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <div
                onClick={() => setAgreed(!agreed)}
                className="w-4 h-4 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors cursor-pointer"
                style={{
                  background: agreed ? 'var(--teal)' : 'transparent',
                  border: `2px solid ${agreed ? 'var(--teal)' : 'var(--dim)'}`,
                }}
              >
                {agreed && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3l2 2 4-4" stroke="#0C0F1A" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <span className="text-xs leading-relaxed" style={{ color: 'var(--soft)' }}>
                I understand that Mina provides educational guidance, not legal advice, and I agree to the Terms of Service and Privacy Policy.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !agreed}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              background: loading || !agreed ? 'var(--dim)' : 'var(--teal)',
              color: '#0C0F1A',
              cursor: loading || !agreed ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black/70 animate-spin-fast" />
                Creating your account...
              </span>
            ) : (
              'Create my free account'
            )}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--dim)' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: 'var(--teal)' }}>
            Sign in
          </a>
        </p>
      </div>

      {/* Privacy note */}
      <p className="text-center text-xs mt-4" style={{ color: 'var(--dim)' }}>
        Private and encrypted. No ads. No data sales.
      </p>
    </div>
  )
}
