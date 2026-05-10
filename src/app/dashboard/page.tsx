'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { MinaAvatar } from '@/components/mina/MinaAvatar'

interface DashboardContext {
  context: {
    situation: string
    totalDebt: number
    monthlyAvailable: number
    totalSavings: number
    pressureLevel: number
    activeDebtCount: number
    pendingActionCount: number
    criticalDeadlineCount: number
    recentMemories: string[]
    unresolvedItems: string[]
    recoveryStage: string
    state: string | null
    language: string
  }
  summary: {
    whatChanged: string[]
    whatImproved: string[]
    whatNeedsAttention: string[]
    nextStep: string
    recoveryStage: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [data, setData] = useState<DashboardContext | null>(null)
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([])
  const [chatLoading, setChatLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const lang = data?.context.language ?? 'en'
  const t = lang === 'es'

  useEffect(() => {
    init()
  }, [])

  async function init() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const name = (user.user_metadata?.full_name as string) ?? ''
    setUserName(name.split(' ')[0] || '')

    try {
      const res = await fetch('/api/context')
      if (res.ok) {
        const contextData = await res.json()
        setData(contextData)
      }
    } catch (e) {
      console.error('Context load error:', e)
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage() {
    if (!chatInput.trim() || chatLoading) return
    const msg = chatInput.trim()
    setChatInput('')
    setChatLoading(true)

    const newMessages = [...chatMessages, { role: 'user', content: msg }]
    setChatMessages(newMessages)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: chatMessages }),
      })
      if (res.ok) {
        const result = await res.json()
        setChatMessages([...newMessages, { role: 'assistant', content: result.response }])
      }
    } catch { /* ignore */ } finally {
      setChatLoading(false)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const stageLabel: Record<string, string> = {
    panic: 'Stabilizing', stabilization: 'Stabilizing',
    organization: 'Getting organized', recovery: 'In recovery', rebuilding: 'Rebuilding',
  }

  const greet = () => {
    const h = new Date().getHours()
    if (h < 12) return t ? 'Buenos días' : 'Good morning'
    if (h < 18) return t ? 'Buenas tardes' : 'Good afternoon'
    return t ? 'Buenas noches' : 'Good evening'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <MinaAvatar size="lg" />
          <p className="font-heading italic text-lg" style={{ color: 'var(--white)' }}>Loading your plan...</p>
        </div>
      </div>
    )
  }

  const ctx = data?.context
  const summary = data?.summary

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 py-3 flex items-center justify-between"
        style={{ background: 'rgba(12,15,26,0.92)', borderBottom: '1px solid var(--bord)', backdropFilter: 'blur(20px)' }}
      >
        <span className="font-heading font-bold text-base" style={{ color: 'var(--white)' }}>
          Sum <span style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Goals</span>
        </span>
        <div className="flex items-center gap-3">
          {ctx && (
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: 'var(--teal-dim)', border: '1px solid var(--teal-b)', color: 'var(--teal)' }}
            >
              {stageLabel[ctx.recoveryStage] ?? 'Getting started'}
            </span>
          )}
          <button
            onClick={signOut}
            className="text-xs"
            style={{ color: 'var(--dim)' }}
          >
            {t ? 'Salir' : 'Sign out'}
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 pb-28">

        {/* Greeting */}
        <div className="mb-6 animate-fade-up">
          <p className="text-xs mb-0.5" style={{ color: 'var(--dim)' }}>{greet()}</p>
          <h1 className="font-heading text-2xl italic font-bold" style={{ color: 'var(--white)' }}>
            {t ? 'Bienvenido de vuelta' : 'Welcome back'}{userName ? ', ' + userName : ''}.
          </h1>
        </div>

        {/* Mina briefing card */}
        <div
          className="rounded-2xl p-5 mb-4 relative overflow-hidden animate-fade-up delay-100"
          style={{ background: 'var(--surface)', border: '1px solid var(--gold-b)' }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: 'linear-gradient(90deg, var(--gold), var(--teal), transparent)' }}
          />
          <div className="flex gap-3 items-start mb-4">
            <MinaAvatar size="sm" />
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--gold)' }}>
                MINA — {t ? 'TU GUÍA' : 'YOUR GUIDE'}
              </div>
              <p className="font-heading italic text-sm leading-relaxed" style={{ color: 'var(--soft)' }}>
                {summary?.nextStep
                  ? summary.nextStep
                  : t ? 'Aquí para ayudarte con tu próximo paso.' : 'Here to help you with your next step.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowChat(true)}
            className="w-full py-2.5 rounded-xl text-sm font-bold"
            style={{ background: 'var(--teal)', color: '#0C0F1A' }}
          >
            {t ? 'Hablar con Mina →' : 'Talk to Mina →'}
          </button>
        </div>

        {/* Unresolved items */}
        {summary && summary.whatNeedsAttention.length > 0 && (
          <div
            className="rounded-2xl p-4 mb-4 animate-fade-up delay-200"
            style={{ background: 'var(--surface)', border: '1px solid var(--bord)' }}
          >
            <div className="text-[10px] font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--muted)' }}>
              {t ? 'Necesita atención' : 'Needs attention'}
            </div>
            <div className="flex flex-col gap-2">
              {summary.whatNeedsAttention.slice(0, 3).map((item, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--gold)' }} />
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What improved */}
        {summary && summary.whatImproved.length > 0 && (
          <div
            className="rounded-2xl p-4 mb-4 animate-fade-up delay-200"
            style={{ background: 'rgba(0,201,167,0.05)', border: '1px solid var(--teal-b)' }}
          >
            <div className="text-[10px] font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--teal)' }}>
              {t ? 'Progreso' : 'Progress'}
            </div>
            {summary.whatImproved.map((item, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--teal)' }} />
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{item}</p>
              </div>
            ))}
          </div>
        )}

        {/* Financial snapshot */}
        {ctx && ctx.totalDebt > 0 && (
          <div
            className="rounded-2xl p-4 mb-4 animate-fade-up delay-300"
            style={{ background: 'var(--surface)', border: '1px solid var(--bord)' }}
          >
            <div className="text-[10px] font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--muted)' }}>
              {t ? 'Instantánea Financiera' : 'Financial Snapshot'}
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: t ? 'Disponible' : 'Available', value: `$${ctx.monthlyAvailable.toLocaleString()}`, color: 'var(--teal)' },
                { label: t ? 'Deuda total' : 'Total debt', value: `$${ctx.totalDebt.toLocaleString()}`, color: 'var(--red)' },
                { label: t ? 'Ahorros' : 'Savings', value: `$${ctx.totalSavings.toLocaleString()}`, color: 'var(--gold)' },
              ].map(item => (
                <div key={item.label} className="text-center rounded-xl p-3" style={{ background: 'var(--surface2)' }}>
                  <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--dim)' }}>{item.label}</div>
                  <div className="font-heading italic text-base font-bold" style={{ color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {[
                { label: t ? 'Deudas activas' : 'Active debts', value: ctx.activeDebtCount },
                { label: t ? 'Acciones pendientes' : 'Pending actions', value: ctx.pendingActionCount },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center px-3 py-2 rounded-lg" style={{ background: 'var(--surface2)' }}>
                  <span className="text-xs" style={{ color: 'var(--dim)' }}>{item.label}</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--white)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="animate-fade-up delay-400">
          <div className="text-[10px] font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--muted)' }}>
            {t ? 'Preguntarle a Mina sobre' : 'Ask Mina about'}
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: t ? 'Responder a un cobrador' : 'Responding to a collector', prompt: 'A debt collector is contacting me. What are my rights and what are the best ways to respond?' },
              { label: t ? 'Validar una deuda' : 'Requesting debt validation', prompt: 'Can you prepare a debt validation letter for me?' },
              { label: t ? 'Opciones de factura médica' : 'Medical bill options', prompt: 'I have a medical bill I cannot afford. What options do I have?' },
              { label: t ? 'Estatuto de limitaciones' : 'Statute of limitations', prompt: 'What is the statute of limitations on my debt in my state?' },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => { setChatInput(action.prompt); setShowChat(true) }}
                className="text-left rounded-xl p-3.5 transition-all text-xs font-medium"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--bord)',
                  color: 'var(--muted)',
                }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal-b)'; (e.currentTarget as HTMLElement).style.color = 'var(--white)' }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--bord)'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Control note */}
        <div className="flex items-center gap-2 mt-6" style={{ color: 'var(--dim)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span className="text-xs italic" style={{ color: 'var(--dim)' }}>
            {t
              ? 'Mina organiza tus opciones — cada decisión queda contigo.'
              : 'Mina organizes your options and prepares guidance — every decision stays with you.'}
          </span>
        </div>
      </div>

      {/* Chat panel */}
      {showChat && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: 'var(--bg)' }}
        >
          {/* Chat header */}
          <div
            className="flex items-center gap-3 px-5 py-3"
            style={{ borderBottom: '1px solid var(--bord)', background: 'rgba(12,15,26,0.92)' }}
          >
            <MinaAvatar size="sm" />
            <div className="flex-1">
              <div className="text-[9px] font-bold tracking-widest uppercase" style={{ color: 'var(--gold)' }}>MINA</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{t ? 'Tu guía' : 'Your guide'}</div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-sm px-3 py-1.5 rounded-lg"
              style={{ border: '1px solid var(--bord)', color: 'var(--muted)' }}
            >
              {t ? 'Cerrar' : 'Close'}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {chatMessages.length === 0 && (
              <div
                className="rounded-2xl p-4 relative overflow-hidden"
                style={{ background: 'var(--surface)', border: '1px solid var(--gold-b)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: 'linear-gradient(90deg, var(--gold), var(--teal), transparent)' }} />
                <p className="font-heading italic text-sm leading-relaxed" style={{ color: 'var(--soft)' }}>
                  {t
                    ? 'Hola. ¿En qué puedo ayudarte hoy?'
                    : ctx?.recentMemories?.[0]
                      ? `I remember: ${ctx.recentMemories[0]}. How can I help you today?`
                      : 'Hello. What can I help you with today?'}
                </p>
              </div>
            )}

            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-2.5'}`}>
                {msg.role === 'assistant' && <MinaAvatar size="sm" showPulse={false} />}
                <div
                  className="max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed"
                  style={msg.role === 'assistant'
                    ? { background: 'var(--surface)', border: '1px solid var(--bord)', color: 'var(--soft)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', borderRadius: '4px 16px 16px 16px' }
                    : { background: 'var(--surface2)', color: 'var(--muted)', borderRadius: '16px 4px 16px 16px' }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex gap-2.5 items-start">
                <MinaAvatar size="sm" showPulse={false} />
                <div className="flex gap-1.5 items-center px-4 py-3 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--bord)' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                      style={{ background: 'var(--teal)', animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            className="px-5 py-3"
            style={{ borderTop: '1px solid var(--bord)', background: 'rgba(12,15,26,0.96)' }}
          >
            <div className="flex gap-2.5">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder={t ? 'Escribe tu pregunta...' : 'Ask Mina anything...'}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{
                  background: 'var(--surface2)',
                  border: '1.5px solid var(--bord)',
                  color: 'var(--white)',
                }}
                autoFocus
              />
              <button
                onClick={sendMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="px-4 py-2.5 rounded-xl text-sm font-bold"
                style={{
                  background: chatLoading || !chatInput.trim() ? 'var(--dim)' : 'var(--teal)',
                  color: '#0C0F1A',
                }}
              >
                {t ? 'Enviar' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
