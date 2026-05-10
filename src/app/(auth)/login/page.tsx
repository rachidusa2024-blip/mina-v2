'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { MinaAvatar } from '@/components/mina/MinaAvatar'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) {
      setError('Incorrect email or password.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const inputStyle = {
    background: 'var(--surface2)',
    border: '1.5px solid var(--bord)',
    color: 'var(--white)',
  }

  return (
    <div className="animate-fade-up">
      {/* Mina message */}
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
              Welcome back. I remember where we left off.
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
          className="font-heading text-2xl italic font-bold mb-6"
          style={{ color: 'var(--white)' }}
        >
          Sign in.
        </h1>

        {error && (
          <div
            className="rounded-lg px-4 py-3 text-sm mb-4"
            style={{ background: 'var(--red-dim)', border: '1px solid var(--red-b)', color: 'var(--red)' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--teal-b)')}
              onBlur={e => (e.target.style.borderColor = 'var(--bord)')}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider uppercase mb-1.5" style={{ color: 'var(--muted)' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg px-3 py-2.5 pr-10 text-sm outline-none"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--teal-b)')}
                onBlur={e => (e.target.style.borderColor = 'var(--bord)')}
                onKeyDown={e => e.key === 'Enter' && handleLogin(e as any)}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all mt-2"
            style={{
              background: loading ? 'var(--dim)' : 'var(--teal)',
              color: '#0C0F1A',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black/70 animate-spin-fast" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--dim)' }}>
          No account yet?{' '}
          <a href="/onboarding" style={{ color: 'var(--teal)' }}>
            Get started
          </a>
        </p>
      </div>
    </div>
  )
}
