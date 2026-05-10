// app/api/briefing/route.ts

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getFinancialContext } from '@/lib/memory'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!

const SITUATION_INSIGHTS: Record<string, string> = {
  collectors: 'Under the Fair Debt Collection Practices Act, you have the right to request written verification of any debt before making payment decisions. Once a collector receives a written validation request, they are generally required to stop collection activity until they provide it.',
  legal: 'Most debt collection lawsuits result in default judgments because people do not respond in writing. Filing a written answer — even a simple one — changes the dynamics significantly and requires the collector to demonstrate their case.',
  medical: 'Studies consistently show the majority of medical bills contain billing errors. Requesting a complete itemized bill with CPT billing codes before making any payment is your right and often reveals charges worth disputing.',
  irs: 'The IRS offers six resolution options that most people are never told about — including Currently Not Collectible status, installment agreements, and Offers in Compromise. Their notices are designed to seem final, but they rarely are.',
  payday: 'Payday lending is entirely prohibited in 18 states and heavily restricted in many others. If your loan was made in violation of your state\'s laws, the amount you legally owe may be different from what the lender claims.',
  credit_card: 'Debt buyers — companies that purchase charged-off debt — typically pay 1 to 7 cents on the dollar for old accounts. This means there is often significant room for negotiation that is not openly advertised.',
  plan: 'Organizing your debts by interest rate and applying any available extra monthly cash to the highest-rate debt first is one of the most effective strategies for reducing total interest paid over time.',
  savings: 'A $1,000 emergency fund, even while carrying debt, significantly reduces the likelihood of taking on new debt when unexpected expenses arise. Building this buffer first is often the right sequence.',
}

const STEP_BY_SITUATION: Record<string, string> = {
  collectors: 'Organize all recent collection letters — note the agency name, account number, and date of first contact. Before any payment discussion, you have the right to request written debt validation.',
  legal: 'Identify the date you were served with court paperwork — your response window typically begins from that date, not the document date. Missing a response deadline can result in a default judgment.',
  medical: 'Request a complete itemized bill with all CPT billing codes from the hospital or provider before making any payment or agreeing to a payment plan.',
  irs: 'Identify the specific IRS notice type — the number is in the upper right corner of the notice. Different notice types have different response timelines and resolution options.',
  payday: 'Review your loan documents carefully and note the state where the loan was originated. Your state\'s laws determine what the lender can legally charge and collect.',
  credit_card: 'List your credit card debts in order of interest rate, highest first. This is the sequence in which to focus extra payments for the most efficient payoff.',
  plan: 'Organize all financial notices and statements in one place. Knowing exactly what you owe and to whom is the foundation that makes any plan actionable.',
  savings: 'Set a specific savings target — $1,000 as an emergency fund is a useful starting milestone. Automate a small transfer on payday if possible.',
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Get profile
    const { data: profile } = await supabase
      .from('financial_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Get context
    const context = await getFinancialContext(user.id)
    const situation = profile?.situation ?? 'plan'
    const lang = profile?.language ?? 'en'
    const isEs = lang === 'es'

    // Get user's name
    const { data: { user: authUser } } = await supabase.auth.getUser()
    const fullName = (authUser?.user_metadata?.full_name as string) ?? ''
    const firstName = fullName.split(' ')[0] || ''

    // Generate personalized greeting from Anthropic
    let situationSummary = ''
    try {
      const promptText = isEs
        ? `Eres Mina, una guía de recuperación financiera. El usuario ${firstName ? 'se llama ' + firstName + ' y ' : ''}acaba de completar su configuración. Su situación: ${situation}, deuda total: $${context.totalDebt.toLocaleString()}, disponible mensual: $${context.monthlyAvailable.toLocaleString()}, ahorros: $${context.totalSavings.toLocaleString()}, nivel de presión: ${context.pressureLevel}/10. Etapa de recuperación: ${context.recoveryStage}. Escribe 2-3 oraciones en español que resuman su situación de forma calmada y honesta. Sin lenguaje dramático. Sin garantías legales. Usa "puede" en lugar de afirmaciones absolutas. Máximo 60 palabras.`
        : `You are Mina, a financial recovery guide. The user ${firstName ? 'is named ' + firstName + ' and ' : ''}just completed setup. Their situation: ${situation}, total debt: $${context.totalDebt.toLocaleString()}, monthly available: $${context.monthlyAvailable.toLocaleString()}, savings: $${context.totalSavings.toLocaleString()}, pressure level: ${context.pressureLevel}/10, recovery stage: ${context.recoveryStage}. Write 2-3 calm, honest sentences summarizing their situation. No dramatic language. No legal guarantees. Use "may" instead of absolutes. Maximum 60 words.`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 150,
          messages: [{ role: 'user', content: promptText }],
        }),
      })
      if (res.ok) {
        const data = await res.json()
        situationSummary = data.content?.[0]?.text ?? ''
      }
    } catch { /* use fallback */ }

    // Fallback summary
    if (!situationSummary) {
      const fallbacks: Record<string, string> = {
        collectors: 'You are dealing with collector contact. The most important thing right now is to understand what this debt is and whether it is valid before making any payment decisions.',
        legal: 'You received legal paperwork. The date you were served matters — your response window begins from that date. This situation may have more options available than it appears.',
        medical: 'Medical bills are challenging — and they often contain errors before any negotiation begins. Reviewing what you are actually being charged before paying is always worth doing.',
        irs: 'IRS notices are designed to seem final. They rarely are. There are several resolution options available depending on your specific situation and notice type.',
        payday: 'Payday loans can create difficult cycles. Your state\'s laws may affect what the lender can actually charge and collect — that is worth understanding before making decisions.',
        credit_card: 'Your credit card debt has a clear path forward. The right sequence of payments can significantly reduce the total interest you pay over time.',
        plan: 'I have organized your financial picture. Your situation is manageable, and having a clear plan makes the next steps much more approachable.',
        savings: 'You are in a strong position. Building a solid emergency fund and a specific savings goal are the right next steps from here.',
      }
      situationSummary = fallbacks[situation] ?? fallbacks.plan
    }

    return NextResponse.json({
      greeting: firstName ? `Your plan is ready${firstName ? ', ' + firstName : ''}.` : 'Your plan is ready.',
      situationSummary,
      immediateStep: STEP_BY_SITUATION[situation] ?? STEP_BY_SITUATION.plan,
      educationalInsight: SITUATION_INSIGHTS[situation] ?? SITUATION_INSIGHTS.plan,
      unresolvedItems: context.unresolvedItems,
      recoveryStage: context.recoveryStage,
      snapshot: {
        totalDebt: context.totalDebt,
        monthlyAvailable: context.monthlyAvailable,
        totalSavings: context.totalSavings,
      },
    })
  } catch (error) {
    console.error('Briefing API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
