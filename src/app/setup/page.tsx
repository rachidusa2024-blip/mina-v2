'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-server'
import { useRouter } from 'next/navigation'
import { MinaAvatar } from '@/components/mina/MinaAvatar'

interface OnboardingData {
  language: 'en' | 'es'
  situation: string
  urgency: string
  primary_goal: string
  state: string
}

interface SetupData {
  monthly_income: number
  income_type: 'stable' | 'variable' | 'freelance'
  monthly_expenses: number
  total_savings: number
  emergency_fund: number
  available_range: string
  debts: Array<{ type: string; balance: number; payment: number; rate: number }>
  no_debts: boolean
}

export default function SetupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null)
  const [setup, setSetup] = useState<SetupData>({
    monthly_income: 0,
    income_type: 'stable',
    monthly_expenses: 0,
    total_savings: 0,
    emergency_fund: 0,
    available_range: '',
    debts: [],
    no_debts: false,
  })

  const t = onboarding?.language === 'es'

  useEffect(() => {
    const stored = localStorage.getItem('mina_onboarding') || localStorage.getItem('mina_pending_setup')
    if (stored) setOnboarding(JSON.parse(stored))
  }, [])

  function addDebt() {
    setSetup(s => ({ ...s, debts: [...s.debts, { type: 'credit_card', balance: 0, payment: 0, rate: 0 }] }))
  }

  function updateDebt(i: number, field: string, value: string | number) {
    setSetup(s => {
      const debts = [...s.debts]
      debts[i] = { ...debts[i], [field]: value }
      return { ...s, debts }
    })
  }

  function removeDebt(i: number) {
    setSetup(s => ({ ...s, debts: s.debts.filter((_, idx) => idx !== i) }))
  }

  async function saveAndContinue() {
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const avail = setup.monthly_income - setup.monthly_expenses
    const totalDebt = setup.debts.reduce((s, d) => s + d.balance, 0)

    // 1. Save financial profile
    await supabase.from('financial_profiles').upsert({
      user_id: user.id,
      state: onboarding?.state ?? null,
      language: onboarding?.language ?? 'en',
      situation: onboarding?.situation ?? null,
      urgency: onboarding?.urgency ?? null,
      primary_goal: onboarding?.primary_goal ?? null,
      monthly_income: setup.monthly_income,
      income_type: setup.income_type,
      monthly_expenses: setup.monthly_expenses,
      available_cash: Math.max(0, avail),
      total_savings: setup.total_savings,
      emergency_fund: setup.emergency_fund,
      pressure_level: getPressureLevel(onboarding?.situation, totalDebt, avail),
    }, { onConflict: 'user_id' })

    // 2. Save debts
    if (setup.debts.length > 0) {
      const debtRows = setup.debts.map(d => ({
        user_id: user.id,
        debt_type: d.type,
        current_balance: d.balance,
        original_balance: d.balance,
        minimum_payment: d.payment,
        interest_rate: d.rate,
        status: 'active',
        in_collections: onboarding?.situation === 'collectors',
      }))
      await supabase.from('debts').insert(debtRows)
    }

    // 3. Save memory events via API
    const memories = buildMemories(onboarding, setup, avail)
    for (const mem of memories) {
      await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mem),
      })
    }

    // 4. Snapshot plan version
    await fetch('/api/memory/snapshot', { method: 'POST' }).catch(() => {})

    // 5. Clear onboarding data
    localStorage.removeItem('mina_onboarding')
    localStorage.removeItem('mina_pending_setup')

    router.push('/briefing')
  }

  function getPressureLevel(situation: string | undefined, totalDebt: number, avail: number): number {
    let level = 3
    if (situation === 'legal') level = 9
    else if (situation === 'irs') level = 8
    else if (situation === 'collectors') level = 7
    else if (situation === 'payday') level = 7
    if (avail < 0) level = Math.min(10, level + 2)
    if (totalDebt > 20000) level = Math.min(10, level + 1)
    return level
  }

  function buildMemories(ob: OnboardingData | null, s: SetupData, avail: number) {
    const mems = []
    if (!ob) return mems

    const sitLabels: Record<string, string> = {
      collectors: 'User is dealing with debt collectors contacting them',
      legal: 'User received court or legal paperwork',
      medical: 'User has medical bills they cannot afford',
      irs: 'User has an IRS or tax issue',
      payday: 'User is trapped in a payday or high-interest loan cycle',
      credit_card: 'User is dealing with high credit card debt',
      plan: 'User needs help building a debt repayment plan',
      savings: 'User is debt free and wants to build savings',
    }

    if (ob.situation && sitLabels[ob.situation]) {
      mems.push({ eventType: 'change', category: 'contextual', summary: sitLabels[ob.situation], importance: 9 })
    }

    if (ob.urgency === 'calls') mems.push({ eventType: 'concern', category: 'emotional', summary: 'User is receiving frequent collection calls', importance: 8 })
    if (ob.urgency === 'court') mems.push({ eventType: 'deadline', category: 'legal', summary: 'User received court paperwork — response deadline may be active', importance: 10 })

    if (s.income_type !== 'stable') mems.push({ eventType: 'preference', category: 'financial', summary: 'User has variable or freelance income — plan should stay flexible', importance: 7 })
    if (avail < 0) mems.push({ eventType: 'concern', category: 'financial', summary: 'User monthly expenses exceed income — cash flow is negative', importance: 9 })
    if (s.total_savings === 0) mems.push({ eventType: 'change', category: 'financial', summary: 'User has no savings — emergency fund does not exist yet', importance: 7 })

    if (ob.primary_goal === 'savings') mems.push({ eventType: 'preference', category: 'financial', summary: 'User prefers building emergency savings before aggressive debt payoff', importance: 7 })
    if (ob.primary_goal === 'negotiate') mems.push({ eventType: 'goal', category: 'behavioral', summary: 'User wants to learn how to negotiate directly with creditors', importance: 7 })

    return mems
  }

  const inputStyle = {
    background: 'var(--surface2)',
    border: '1.5px solid var(--bord)',
    color: 'var(--white)',
  }

  // Step 0 — Income
  if (step === 0) {
    return (
      <SetupShell
        step={0} total={3}
        title={t ? 'Ingreso mensual' : 'Monthly income'}
        minaMsg={t ? 'Cuéntame sobre tus ingresos. Un estimado está completamente bien.' : 'Tell me about your income. An estimate is completely fine.'}
        onNext={() => setStep(1)}
        nextDisabled={setup.monthly_income === 0}
      >
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold tracking-wider uppercase block mb-1.5" style={{ color: 'var(--muted)' }}>
              {t ? 'Ingreso mensual neto (después de impuestos)' : 'Monthly take-home income (after taxes)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--dim)' }}>$</span>
              <input
                type="number" min="0"
                value={setup.monthly_income || ''}
                onChange={e => setSetup(s => ({ ...s, monthly_income: Number(e.target.value) }))}
                placeholder="0"
                className="w-full rounded-xl pl-7 pr-4 py-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <p className="text-xs mt-1.5" style={{ color: 'var(--dim)' }}>
              {t ? 'Solo tu ingreso neto. Un estimado está bien.' : 'Take-home pay only. An estimate is fine.'}
            </p>
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-wider uppercase block mb-2" style={{ color: 'var(--muted)' }}>
              {t ? 'Tipo de ingreso' : 'Income type'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['stable', 'variable', 'freelance'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSetup(s => ({ ...s, income_type: type }))}
                  className="py-2.5 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: setup.income_type === type ? 'var(--teal-dim)' : 'var(--surface2)',
                    border: `1.5px solid ${setup.income_type === type ? 'var(--teal-b)' : 'var(--bord)'}`,
                    color: setup.income_type === type ? 'var(--white)' : 'var(--muted)',
                  }}
                >
                  {type === 'stable' ? (t ? 'Estable' : 'Stable') : type === 'variable' ? (t ? 'Variable' : 'Variable') : (t ? 'Freelance' : 'Freelance')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-wider uppercase block mb-1.5" style={{ color: 'var(--muted)' }}>
              {t ? 'Gastos esenciales mensuales (estimado)' : 'Essential monthly expenses (estimate)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--dim)' }}>$</span>
              <input
                type="number" min="0"
                value={setup.monthly_expenses || ''}
                onChange={e => setSetup(s => ({ ...s, monthly_expenses: Number(e.target.value) }))}
                placeholder="0"
                className="w-full rounded-xl pl-7 pr-4 py-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <p className="text-xs mt-1.5" style={{ color: 'var(--dim)' }}>
              {t ? 'Vivienda, comida, transporte, servicios.' : 'Housing, food, transport, utilities.'}
            </p>
          </div>
        </div>
      </SetupShell>
    )
  }

  // Step 1 — Debts
  if (step === 1) {
    return (
      <SetupShell
        step={1} total={3}
        title={t ? 'Tus deudas' : 'Your debts'}
        minaMsg={t ? 'Agrega tus deudas. Los estimados están bien — nada necesita ser exacto.' : 'Add your debts. Estimates are fine — nothing needs to be exact.'}
        onBack={() => setStep(0)}
        onNext={() => setStep(2)}
      >
        <div className="space-y-3">
          {setup.debts.map((debt, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'var(--surface2)', border: '1px solid var(--bord)' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
                  {t ? `Deuda ${i + 1}` : `Debt ${i + 1}`}
                </span>
                <button onClick={() => removeDebt(i)} className="text-sm" style={{ color: 'var(--dim)' }}>×</button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="col-span-2">
                  <select
                    value={debt.type}
                    onChange={e => updateDebt(i, 'type', e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-xs outline-none appearance-none"
                    style={inputStyle}
                  >
                    {[
                      { v: 'credit_card', l: t ? 'Tarjeta de crédito' : 'Credit card' },
                      { v: 'medical', l: t ? 'Deuda médica' : 'Medical debt' },
                      { v: 'personal_loan', l: t ? 'Préstamo personal' : 'Personal loan' },
                      { v: 'payday_loan', l: t ? 'Préstamo de día de pago' : 'Payday loan' },
                      { v: 'student_loan', l: t ? 'Préstamo estudiantil' : 'Student loan' },
                      { v: 'car_loan', l: t ? 'Préstamo de auto' : 'Car loan' },
                      { v: 'irs', l: t ? 'Deuda del IRS' : 'IRS debt' },
                      { v: 'collection', l: t ? 'Deuda en cobranzas' : 'Debt in collections' },
                      { v: 'other', l: t ? 'Otra deuda' : 'Other' },
                    ].map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--dim)' }}>$</span>
                  <input type="number" min="0" placeholder={t ? 'Saldo' : 'Balance'} value={debt.balance || ''}
                    onChange={e => updateDebt(i, 'balance', Number(e.target.value))}
                    className="w-full rounded-lg pl-6 pr-2 py-2 text-xs outline-none" style={inputStyle} />
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--dim)' }}>$</span>
                  <input type="number" min="0" placeholder={t ? 'Pago min' : 'Min payment'} value={debt.payment || ''}
                    onChange={e => updateDebt(i, 'payment', Number(e.target.value))}
                    className="w-full rounded-lg pl-6 pr-2 py-2 text-xs outline-none" style={inputStyle} />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addDebt}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all"
            style={{ border: '1.5px dashed rgba(255,255,255,0.08)', color: 'var(--dim)', background: 'transparent' }}
            onMouseOver={e => { (e.target as HTMLElement).style.borderColor = 'var(--teal-b)'; (e.target as HTMLElement).style.color = 'var(--teal)' }}
            onMouseOut={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.target as HTMLElement).style.color = 'var(--dim)' }}
          >
            + {t ? 'Agregar una deuda' : 'Add a debt'}
          </button>

          {setup.debts.length === 0 && (
            <button
              onClick={() => setSetup(s => ({ ...s, no_debts: !s.no_debts }))}
              className="w-full py-3 rounded-xl text-sm flex items-center gap-2.5 px-4"
              style={{
                background: setup.no_debts ? 'var(--teal-dim)' : 'var(--surface)',
                border: `1.5px solid ${setup.no_debts ? 'var(--teal-b)' : 'var(--bord)'}`,
                color: setup.no_debts ? 'var(--white)' : 'var(--muted)',
              }}
            >
              <div className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center"
                style={{ background: setup.no_debts ? 'var(--teal)' : 'transparent', border: `2px solid ${setup.no_debts ? 'var(--teal)' : 'var(--dim)'}` }}>
                {setup.no_debts && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="#0C0F1A" strokeWidth="2" strokeLinecap="round"/></svg>}
              </div>
              {t ? 'No tengo deudas que agregar ahora mismo' : 'I have no debts to add right now'}
            </button>
          )}
        </div>
      </SetupShell>
    )
  }

  // Step 2 — Savings
  if (step === 2) {
    return (
      <SetupShell
        step={2} total={3}
        title={t ? 'Tus ahorros' : 'Your savings'}
        minaMsg={t ? '¿Cuánto tienes ahorrado ahora mismo? Cero es una respuesta completamente válida.' : 'How much do you currently have saved? Zero is a completely valid answer.'}
        onBack={() => setStep(1)}
        onNext={saveAndContinue}
        nextLabel={t ? 'Ver mi plan' : 'See my plan'}
        saving={saving}
      >
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold tracking-wider uppercase block mb-1.5" style={{ color: 'var(--muted)' }}>
              {t ? 'Total de ahorros (todas las cuentas)' : 'Total savings (all accounts)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--dim)' }}>$</span>
              <input type="number" min="0"
                value={setup.total_savings || ''}
                onChange={e => setSetup(s => ({ ...s, total_savings: Number(e.target.value) }))}
                placeholder="0"
                className="w-full rounded-xl pl-7 pr-4 py-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-wider uppercase block mb-1.5" style={{ color: 'var(--muted)' }}>
              {t ? 'Fondo de emergencia específico' : 'Emergency fund specifically'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--dim)' }}>$</span>
              <input type="number" min="0"
                value={setup.emergency_fund || ''}
                onChange={e => setSetup(s => ({ ...s, emergency_fund: Number(e.target.value) }))}
                placeholder="0"
                className="w-full rounded-xl pl-7 pr-4 py-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <p className="text-xs mt-1.5" style={{ color: 'var(--dim)' }}>
              {t ? 'Puede ser parte del total de ahorros.' : 'Can be part of your total savings amount.'}
            </p>
          </div>
        </div>
      </SetupShell>
    )
  }

  return null
}

// ── Setup shell ───────────────────────────────────────────────────────────────
function SetupShell({
  children, step, total, title, minaMsg, onBack, onNext, nextLabel, nextDisabled, saving
}: {
  children: React.ReactNode
  step: number
  total: number
  title: string
  minaMsg: string
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  saving?: boolean
}) {
  const progress = Math.round(((step + 1) / (total + 1)) * 100)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="h-0.5 w-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div className="h-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--teal), var(--gold))' }} />
      </div>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--bord)' }}>
        <span className="font-heading font-bold text-base" style={{ color: 'var(--white)' }}>
          Sum <span style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Goals</span>
        </span>
        <span className="text-xs" style={{ color: 'var(--dim)' }}>{step + 1} / {total}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 max-w-lg mx-auto w-full">
        <div className="animate-fade-up">
          {/* Mina */}
          <div className="flex gap-3 items-start mb-5">
            <MinaAvatar size="sm" showPulse />
            <div>
              <div className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--gold)' }}>MINA</div>
              <p className="font-heading italic text-sm leading-relaxed" style={{ color: 'var(--soft)' }}>{minaMsg}</p>
            </div>
          </div>
          <h2 className="font-heading text-2xl italic font-bold mb-5" style={{ color: 'var(--white)' }}>{title}</h2>
          {children}
        </div>
      </div>

      <div className="sticky bottom-0 px-5 py-3 flex gap-3" style={{ background: 'rgba(12,15,26,0.96)', borderTop: '1px solid var(--bord)' }}>
        {onBack && (
          <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-sm font-medium"
            style={{ border: '1.5px solid var(--bord)', color: 'var(--muted)', background: 'transparent' }}>
            Back
          </button>
        )}
        {onNext && (
          <button onClick={onNext} disabled={nextDisabled || saving} className="flex-1 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: nextDisabled || saving ? 'var(--dim)' : 'var(--teal)', color: '#0C0F1A', cursor: nextDisabled || saving ? 'not-allowed' : 'pointer' }}>
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black/70 animate-spin-fast" />
                Saving...
              </span>
            ) : (nextLabel || 'Continue')}
          </button>
        )}
      </div>
    </div>
  )
}
