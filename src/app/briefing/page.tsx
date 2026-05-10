'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MinaAvatar } from '@/components/mina/MinaAvatar'

interface BriefingData {
  greeting: string
  situationSummary: string
  immediateStep: string
  educationalInsight: string
  unresolvedItems: string[]
  recoveryStage: string
  snapshot: {
    totalDebt: number
    monthlyAvailable: number
    totalSavings: number
  }
}

export default function BriefingPage() {
  const router = useRouter()
  const [briefing, setBriefing] = useState<BriefingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    loadBriefing()
  }, [])

  // Reveal sections one at a time
  useEffect(() => {
    if (!briefing) return
    const timer = setInterval(() => {
      setVisible(v => {
        if (v >= 4) { clearInterval(timer); return v }
        return v + 1
      })
    }, 700)
    return () => clearInterval(timer)
  }, [briefing])

  async function loadBriefing() {
    try {
      const res = await fetch('/api/briefing')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setBriefing(data)
    } catch {
      // Fallback briefing if API fails
      setBriefing({
        greeting: 'Your plan is ready.',
        situationSummary: 'I have organized your financial picture based on what you shared. Nothing here looks irreversible.',
        immediateStep: 'Start by reviewing the next steps I have prepared based on your situation.',
        educationalInsight: 'Most people dealing with financial stress have more options available than they realize.',
        unresolvedItems: [],
        recoveryStage: 'organization',
        snapshot: { totalDebt: 0, monthlyAvailable: 0, totalSavings: 0 },
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: 'var(--bg)' }}>
        <MinaAvatar size="lg" />
        <div>
          <p className="font-heading italic text-lg text-center mb-1" style={{ color: 'var(--white)' }}>
            Reviewing your situation...
          </p>
          <p className="text-sm text-center" style={{ color: 'var(--dim)' }}>
            Building your personalized plan.
          </p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
              style={{ background: 'var(--teal)', animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (!briefing) return null

  const stageLabelMap: Record<string, string> = {
    panic: 'Stabilizing', stabilization: 'Stabilizing', organization: 'Getting organized',
    recovery: 'In recovery', rebuilding: 'Rebuilding',
  }
  const stageLabel = stageLabelMap[briefing.recoveryStage] || 'Getting started'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-lg mx-auto px-5 pt-10 pb-24">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-heading font-bold text-lg" style={{ color: 'var(--white)' }}>
            Sum <span style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Goals</span>
          </span>
        </div>

        {/* Mina avatar + greeting */}
        <div className="flex flex-col items-center mb-8 animate-fade-up">
          <MinaAvatar size="lg" />
          <h1 className="font-heading text-2xl italic font-bold mt-4 text-center" style={{ color: 'var(--white)' }}>
            {briefing.greeting}
          </h1>
        </div>

        {/* Situation summary — Mina's first briefing */}
        {visible >= 1 && (
          <div
            className="rounded-2xl p-5 mb-4 relative overflow-hidden animate-fade-up"
            style={{ background: 'var(--surface)', border: '1px solid var(--gold-b)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: 'linear-gradient(90deg, var(--gold), var(--teal), transparent)' }} />
            <div className="flex gap-3">
              <MinaAvatar size="sm" showPulse={false} />
              <div>
                <div className="text-[9px] font-bold tracking-widest uppercase mb-1.5" style={{ color: 'var(--gold)' }}>
                  MINA
                </div>
                <p className="font-heading italic text-sm leading-relaxed" style={{ color: 'var(--soft)' }}>
                  {briefing.situationSummary}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Financial snapshot */}
        {visible >= 2 && briefing.snapshot.totalDebt > 0 && (
          <div
            className="rounded-2xl p-4 mb-4 animate-fade-up"
            style={{ background: 'var(--surface)', border: '1px solid var(--bord)' }}
          >
            <div className="text-[10px] font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--muted)' }}>
              Financial Snapshot
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Available', value: `$${briefing.snapshot.monthlyAvailable.toLocaleString()}`, color: 'var(--teal)' },
                { label: 'Total debt', value: `$${briefing.snapshot.totalDebt.toLocaleString()}`, color: 'var(--red)' },
                { label: 'Savings', value: `$${briefing.snapshot.totalSavings.toLocaleString()}`, color: 'var(--gold)' },
              ].map(item => (
                <div key={item.label} className="text-center rounded-xl p-3" style={{ background: 'var(--surface2)' }}>
                  <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--dim)' }}>{item.label}</div>
                  <div className="font-heading italic text-lg" style={{ color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--dim)' }}>Recovery stage</span>
              <span className="text-xs font-semibold" style={{ color: 'var(--teal)' }}>{stageLabel}</span>
            </div>
          </div>
        )}

        {/* Immediate next step */}
        {visible >= 3 && (
          <div
            className="rounded-2xl p-5 mb-4 animate-fade-up"
            style={{ background: 'rgba(0,201,167,0.05)', border: '1px solid var(--teal-b)' }}
          >
            <div className="text-[10px] font-bold tracking-wider uppercase mb-2" style={{ color: 'var(--teal)' }}>
              Your immediate next step
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--soft)' }}>
              {briefing.immediateStep}
            </p>
          </div>
        )}

        {/* Educational insight */}
        {visible >= 4 && (
          <div
            className="rounded-2xl p-5 mb-6 animate-fade-up"
            style={{ background: 'var(--surface)', border: '1px solid var(--bord)' }}
          >
            <div className="text-[10px] font-bold tracking-wider uppercase mb-2" style={{ color: 'var(--muted)' }}>
              One thing worth knowing
            </div>
            <p className="font-heading italic text-sm leading-relaxed" style={{ color: 'var(--soft)' }}>
              {briefing.educationalInsight}
            </p>
          </div>
        )}

        {/* Reassurance */}
        {visible >= 4 && (
          <p
            className="text-sm text-center mb-8 animate-fade-up"
            style={{ color: 'var(--dim)', fontStyle: 'italic' }}
          >
            Nothing in your situation looks irreversible. We will work through this step by step.
          </p>
        )}

        {/* CTA */}
        {visible >= 4 && (
          <div className="animate-fade-up">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3.5 rounded-xl text-sm font-bold mb-3"
              style={{ background: 'var(--teal)', color: '#0C0F1A' }}
            >
              Open my dashboard with Mina →
            </button>
            <p className="text-center text-xs" style={{ color: 'var(--dim)' }}>
              Private. Secure. Yours.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
