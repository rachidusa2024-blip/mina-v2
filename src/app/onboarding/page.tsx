'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MinaAvatar } from '@/components/mina/MinaAvatar'

// ── Types ────────────────────────────────────────────────────────────────────
interface OnboardingData {
  language: 'en' | 'es'
  situation: string
  urgency: string
  primary_goal: string
  state: string
}

// ── Step definitions ──────────────────────────────────────────────────────────
const URGENT_SITUATIONS = ['collectors', 'legal', 'irs', 'payday']

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming','Washington D.C.'
]

const STATE_CODES: Record<string, string> = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS',
  'Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA',
  'Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT',
  'Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM',
  'New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK',
  'Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
  'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
  'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY',
  'Washington D.C.':'DC'
}

// ── Choice card component ──────────────────────────────────────────────────────
function Choice({
  label, sub, selected, onClick
}: { label: string; sub?: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl px-4 py-3.5 transition-all"
      style={{
        background: selected ? 'var(--teal-dim)' : 'var(--surface)',
        border: `1.5px solid ${selected ? 'var(--teal-b)' : 'var(--bord)'}`,
        borderLeft: `3px solid ${selected ? 'var(--teal)' : 'transparent'}`,
      }}
    >
      <div className="text-sm font-medium" style={{ color: selected ? 'var(--white)' : 'var(--muted)' }}>
        {label}
      </div>
      {sub && (
        <div className="text-xs mt-0.5" style={{ color: selected ? 'rgba(0,201,167,0.6)' : 'var(--dim)' }}>
          {sub}
        </div>
      )}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    language: 'en',
    situation: '',
    urgency: '',
    primary_goal: '',
    state: '',
  })

  const totalSteps = URGENT_SITUATIONS.includes(data.situation) ? 5 : 4
  const progress = Math.round((step / totalSteps) * 100)

  function next() { setStep(s => s + 1) }
  function back() { setStep(s => Math.max(0, s - 1)) }

  function selectAndAdvance(field: keyof OnboardingData, value: string) {
    const updated = { ...data, [field]: value }
    setData(updated)

    // Auto-advance after short delay
    setTimeout(() => {
      if (field === 'situation') {
        // Skip urgency for non-urgent situations
        if (!URGENT_SITUATIONS.includes(value)) {
          setStep(2) // skip urgency
        } else {
          setStep(1)
        }
      } else if (field === 'urgency') {
        setStep(2)
      } else if (field === 'primary_goal') {
        setStep(URGENT_SITUATIONS.includes(updated.situation) ? 3 : 3)
      } else if (field === 'state') {
        // Save and go to signup
        localStorage.setItem('mina_onboarding', JSON.stringify(updated))
        router.push('/signup')
      }
    }, 200)
  }

  // Step 0 — Language
  if (step === 0) {
    return (
      <OnboardingShell step={0} total={totalSteps} progress={progress} canBack={false} onBack={back}>
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <MinaAvatar size="lg" />
          </div>
          <h1 className="font-heading text-3xl italic font-bold mb-3" style={{ color: 'var(--white)' }}>
            Welcome to Mina.
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
            I can guide you in English or Spanish.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setData({ ...data, language: 'en' }); next() }}
              className="px-8 py-3 rounded-full text-sm font-bold transition-all"
              style={{ background: 'var(--teal)', color: '#0C0F1A' }}
            >
              English
            </button>
            <button
              onClick={() => { setData({ ...data, language: 'es' }); next() }}
              className="px-8 py-3 rounded-full text-sm font-bold transition-all"
              style={{ border: '1.5px solid var(--bord)', color: 'var(--muted)', background: 'transparent' }}
            >
              Español
            </button>
          </div>
          <p className="text-xs mt-6" style={{ color: 'var(--dim)' }}>
            Your information stays private and encrypted.
          </p>
        </div>
      </OnboardingShell>
    )
  }

  // Step 1 — Situation
  if (step === 1) {
    const t = data.language === 'es'
    return (
      <OnboardingShell step={1} total={totalSteps} progress={progress} canBack onBack={back}>
        <MinaQuestion
          message={t ? 'Cuéntame qué te trajo aquí hoy. Ajustaré tu plan según tu situación.' : 'Tell me what brought you here today. I will adjust your plan based on your situation.'}
          title={t ? '¿Con qué necesitas ayuda?' : 'What do you need help with?'}
          hint={t ? 'Elige la que mejor describe tu situación.' : 'Choose the one that fits best right now.'}
        />
        <div className="flex flex-col gap-2 mt-5">
          {[
            { value: 'credit_card', label: t ? 'Deuda de tarjeta de crédito' : 'Credit card debt', sub: t ? 'Saldos altos e intereses que suben' : 'High balances and rising interest' },
            { value: 'collectors', label: t ? 'Cobradores contactándome' : 'Debt collectors contacting me', sub: t ? 'Llamadas, cartas o mensajes' : 'Calls, letters, or messages' },
            { value: 'medical', label: t ? 'Facturas médicas' : 'Medical bills', sub: t ? 'Facturas que no puedo pagar' : 'Bills I cannot afford or understand' },
            { value: 'irs', label: t ? 'Problema con el IRS o impuestos' : 'IRS or tax issue', sub: t ? 'Deuda tributaria o avisos del IRS' : 'Tax debt or IRS notices' },
            { value: 'legal', label: t ? 'Aviso judicial o legal' : 'Court or legal notice', sub: t ? 'Citación, demanda o documentos' : 'Summons, lawsuit, or paperwork' },
            { value: 'payday', label: t ? 'Préstamo de alto interés' : 'Payday or high-interest loan', sub: t ? 'Ciclo de préstamo que no termina' : 'Trapped in a loan cycle' },
            { value: 'plan', label: t ? 'Solo necesito un plan' : 'I just need a plan', sub: t ? 'Atrasado en pagos, necesito dirección' : 'Behind on payments and need direction' },
            { value: 'savings', label: t ? 'Estoy libre de deudas y quiero ahorrar' : 'I am debt free — I want to build savings', sub: t ? 'Fondo de emergencia y estabilidad' : 'Emergency fund and financial stability' },
          ].map(opt => (
            <Choice
              key={opt.value}
              label={opt.label}
              sub={opt.sub}
              selected={data.situation === opt.value}
              onClick={() => selectAndAdvance('situation', opt.value)}
            />
          ))}
        </div>
      </OnboardingShell>
    )
  }

  // Step 2 — Urgency (only for certain situations)
  if (step === 2 && URGENT_SITUATIONS.includes(data.situation)) {
    const t = data.language === 'es'
    return (
      <OnboardingShell step={2} total={totalSteps} progress={progress} canBack onBack={back}>
        <MinaQuestion
          message={t ? '¿Qué tan urgente se siente esto ahora mismo?' : 'How urgent does this feel right now?'}
          title={t ? '¿Qué está pasando ahora mismo?' : 'What is happening right now?'}
          hint={t ? 'Esto me ayuda a priorizar el primer paso.' : 'This helps me know where to start.'}
        />
        <div className="flex flex-col gap-2 mt-5">
          {[
            { value: 'letter', label: t ? 'Recibí una carta o aviso' : 'I received a letter or notice' },
            { value: 'calls', label: t ? 'Estoy recibiendo llamadas o mensajes' : 'I am getting calls or messages' },
            { value: 'court', label: t ? 'Recibí documentos judiciales' : 'I received court paperwork' },
            { value: 'behind', label: t ? 'Estoy atrasado en mis pagos' : 'I am behind on payments' },
            { value: 'unsure', label: t ? 'No estoy seguro de qué tan serio es esto' : 'I am not sure how serious this is' },
            { value: 'proactive', label: t ? 'Quiero adelantarme antes de que empeore' : 'I want to get ahead before it gets worse' },
          ].map(opt => (
            <Choice
              key={opt.value}
              label={opt.label}
              selected={data.urgency === opt.value}
              onClick={() => selectAndAdvance('urgency', opt.value)}
            />
          ))}
        </div>
      </OnboardingShell>
    )
  }

  // Step 3 — Primary goal (shown at step 2 for non-urgent, step 3 for urgent)
  const goalStep = URGENT_SITUATIONS.includes(data.situation) ? 3 : 2
  if (step === goalStep) {
    const t = data.language === 'es'
    return (
      <OnboardingShell step={goalStep} total={totalSteps} progress={progress} canBack onBack={back}>
        <MinaQuestion
          message={t ? '¿Qué te ayudaría más en este momento?' : 'What would help you most right now?'}
          title={t ? 'Tu objetivo principal.' : 'Your main goal.'}
        />
        <div className="flex flex-col gap-2 mt-5">
          {[
            { value: 'understand', label: t ? 'Entender qué significan mis avisos o facturas' : 'Understand what my notices or bills actually mean' },
            { value: 'strategy', label: t ? 'Construir una estrategia clara de pago' : 'Build a clear repayment strategy' },
            { value: 'organize', label: t ? 'Reducir el estrés y organizarme' : 'Reduce stress and get organized' },
            { value: 'negotiate', label: t ? 'Prepararme para negociar con acreedores' : 'Prepare to negotiate with creditors' },
            { value: 'options', label: t ? 'Entender todas mis opciones' : 'Understand all my options' },
            { value: 'professional', label: t ? 'Saber si necesito un abogado' : 'Know if I need a lawyer or professional' },
            { value: 'savings', label: t ? 'Construir ahorros y un fondo de emergencia' : 'Build savings and an emergency fund' },
          ].map(opt => (
            <Choice
              key={opt.value}
              label={opt.label}
              selected={data.primary_goal === opt.value}
              onClick={() => { setData({ ...data, primary_goal: opt.value }); setStep(goalStep + 1) }}
            />
          ))}
        </div>
      </OnboardingShell>
    )
  }

  // Step 4 — State of residence
  const stateStep = goalStep + 1
  if (step === stateStep) {
    const t = data.language === 'es'
    return (
      <OnboardingShell
        step={stateStep}
        total={totalSteps}
        progress={progress}
        canBack
        onBack={back}
        nextLabel={t ? 'Continuar' : 'Continue'}
        onNext={() => {
          if (!data.state) return
          localStorage.setItem('mina_onboarding', JSON.stringify(data))
          router.push('/signup')
        }}
        nextDisabled={!data.state}
      >
        <MinaQuestion
          message={t ? 'Tu estado importa. Las protecciones financieras y las leyes de deuda varían significativamente.' : 'Your state matters. Financial protections and debt laws vary significantly.'}
          title={t ? '¿En qué estado vives?' : 'What state do you live in?'}
        />
        <div className="mt-5">
          <select
            value={data.state}
            onChange={e => setData({ ...data, state: e.target.value })}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none appearance-none"
            style={{
              background: 'var(--surface)',
              border: `1.5px solid ${data.state ? 'var(--teal-b)' : 'var(--bord)'}`,
              color: data.state ? 'var(--white)' : 'var(--dim)',
            }}
          >
            <option value="">{t ? 'Selecciona tu estado...' : 'Select your state...'}</option>
            {US_STATES.map(s => (
              <option key={s} value={STATE_CODES[s] || s}>{s}</option>
            ))}
          </select>
          <p className="text-xs mt-3 flex items-center gap-2" style={{ color: 'var(--dim)' }}>
            <span>—</span>
            {t
              ? 'Solo tu estado — nunca tu dirección completa. Esto ayuda a Mina a darte orientación más precisa.'
              : 'Only your state — never your full address. This helps Mina provide more accurate guidance.'}
          </p>
        </div>
      </OnboardingShell>
    )
  }

  return null
}

// ── Shell ─────────────────────────────────────────────────────────────────────
function OnboardingShell({
  children, step, total, progress, canBack, onBack, nextLabel, onNext, nextDisabled
}: {
  children: React.ReactNode
  step: number
  total: number
  progress: number
  canBack: boolean
  onBack: () => void
  nextLabel?: string
  onNext?: () => void
  nextDisabled?: boolean
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Progress bar */}
      <div className="h-0.5 w-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--teal), var(--gold))' }}
        />
      </div>

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid var(--bord)', background: 'rgba(12,15,26,0.92)' }}
      >
        <span className="font-heading font-bold text-base" style={{ color: 'var(--white)' }}>
          Sum <span style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Goals</span>
        </span>
        <span className="text-xs" style={{ color: 'var(--dim)' }}>
          {step + 1} / {total + 1}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 max-w-lg mx-auto w-full">
        <div className="animate-fade-up">
          {children}
        </div>
      </div>

      {/* Nav */}
      {(canBack || onNext) && (
        <div
          className="sticky bottom-0 px-5 py-3 flex gap-3"
          style={{ background: 'rgba(12,15,26,0.96)', borderTop: '1px solid var(--bord)' }}
        >
          {canBack && (
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ border: '1.5px solid var(--bord)', color: 'var(--muted)', background: 'transparent' }}
            >
              Back
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold"
              style={{
                background: nextDisabled ? 'var(--dim)' : 'var(--teal)',
                color: '#0C0F1A',
                cursor: nextDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              {nextLabel || 'Continue'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Mina question header ───────────────────────────────────────────────────────
function MinaQuestion({ message, title, hint }: { message: string; title: string; hint?: string }) {
  return (
    <div className="mb-1">
      <div className="flex gap-3 items-start mb-5">
        <MinaAvatar size="sm" showPulse />
        <div>
          <div className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--gold)' }}>
            MINA
          </div>
          <p className="font-heading italic text-sm leading-relaxed" style={{ color: 'var(--soft)' }}>
            {message}
          </p>
        </div>
      </div>
      <h2 className="font-heading text-2xl italic font-bold mb-1" style={{ color: 'var(--white)' }}>
        {title}
      </h2>
      {hint && <p className="text-xs" style={{ color: 'var(--dim)' }}>{hint}</p>}
    </div>
  )
}
