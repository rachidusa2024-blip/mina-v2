// ─────────────────────────────────────────────────────────────────────────────
// MINA MEMORY ENGINE
// The core brain — all persistent memory operations
// ─────────────────────────────────────────────────────────────────────────────

import { createServerSupabaseClient } from '@/lib/supabase'
import type {
  MemoryEvent,
  MemoryEventType,
  MemoryCategory,
  ActionItem,
  ActionPriority,
  ActionCategory,
  FinancialContextSummary,
  MinaContext,
  RecoveryStage,
  Language,
} from '@/types/database'

// ── saveMemoryEvent ───────────────────────────────────────────────────────────
// Call this any time something important happens that Mina should remember.
// Examples:
//   saveMemoryEvent(userId, 'fear', 'emotional', 'User fears answering collection calls', 8)
//   saveMemoryEvent(userId, 'upload', 'contextual', 'User uploaded hospital bill from Mercy Medical', 7)
//   saveMemoryEvent(userId, 'decision', 'behavioral', 'User decided to send debt validation letter', 9)

export async function saveMemoryEvent(
  userId: string,
  eventType: MemoryEventType,
  category: MemoryCategory,
  summary: string,
  importance: number = 5,
  options?: {
    detail?: string
    relatedDebtId?: string
    relatedDocId?: string
    expiresAt?: string
  }
): Promise<MemoryEvent | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('memory_events')
    .insert({
      user_id: userId,
      event_type: eventType,
      category,
      summary,
      importance,
      detail: options?.detail ?? null,
      related_debt_id: options?.relatedDebtId ?? null,
      related_doc_id: options?.relatedDocId ?? null,
      expires_at: options?.expiresAt ?? null,
    })
    .select()
    .single()

  if (error) {
    console.error('saveMemoryEvent error:', error)
    return null
  }

  return data
}

// ── getActiveMemories ─────────────────────────────────────────────────────────
// Returns the most important unresolved memories for a user.
// Used to build Mina's context on every conversation.

export async function getActiveMemories(
  userId: string,
  limit: number = 15
): Promise<MemoryEvent[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('memory_events')
    .select('*')
    .eq('user_id', userId)
    .eq('is_resolved', false)
    .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
    .order('importance', { ascending: false })
    .order('occurred_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getActiveMemories error:', error)
    return []
  }

  return data ?? []
}

// ── resolveMemoryEvent ────────────────────────────────────────────────────────
// Mark a memory as resolved — it stops surfacing in context.

export async function resolveMemoryEvent(
  userId: string,
  memoryId: string
): Promise<void> {
  const supabase = await createServerSupabaseClient()

  await supabase
    .from('memory_events')
    .update({ is_resolved: true })
    .eq('id', memoryId)
    .eq('user_id', userId)
}

// ── createActionItem ──────────────────────────────────────────────────────────
// Add a task for the user that Mina tracks automatically.

export async function createActionItem(
  userId: string,
  title: string,
  options?: {
    description?: string
    category?: ActionCategory
    priority?: ActionPriority
    dueDate?: string
    relatedDebtId?: string
    relatedDocId?: string
  }
): Promise<ActionItem | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('action_items')
    .insert({
      user_id: userId,
      title,
      description: options?.description ?? null,
      category: options?.category ?? null,
      priority: options?.priority ?? 'medium',
      due_date: options?.dueDate ?? null,
      related_debt_id: options?.relatedDebtId ?? null,
      related_doc_id: options?.relatedDocId ?? null,
      created_by: 'mina',
    })
    .select()
    .single()

  if (error) {
    console.error('createActionItem error:', error)
    return null
  }

  return data
}

// ── completeActionItem ────────────────────────────────────────────────────────

export async function completeActionItem(
  userId: string,
  actionId: string
): Promise<void> {
  const supabase = await createServerSupabaseClient()

  await supabase
    .from('action_items')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', actionId)
    .eq('user_id', userId)
}

// ── getPendingActions ─────────────────────────────────────────────────────────

export async function getPendingActions(userId: string): Promise<ActionItem[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('action_items')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['pending', 'in_progress', 'overdue'])
    .order('priority', { ascending: false })
    .order('due_date', { ascending: true })
    .limit(10)

  if (error) {
    console.error('getPendingActions error:', error)
    return []
  }

  return data ?? []
}

// ── getUnresolvedItems ────────────────────────────────────────────────────────
// Returns a list of plain-text descriptions of what still needs attention.
// This is what powers "What still needs attention?" in Mina's briefing.

export async function getUnresolvedItems(userId: string): Promise<string[]> {
  const supabase = await createServerSupabaseClient()
  const items: string[] = []

  // Overdue actions
  const { data: overdueActions } = await supabase
    .from('action_items')
    .select('title, due_date')
    .eq('user_id', userId)
    .eq('status', 'overdue')
    .limit(5)

  overdueActions?.forEach((a) => {
    items.push(`Overdue: ${a.title}${a.due_date ? ` (was due ${a.due_date})` : ''}`)
  })

  // Upcoming deadlines
  const soon = new Date()
  soon.setDate(soon.getDate() + 14)

  const { data: deadlines } = await supabase
    .from('deadlines')
    .select('title, due_date, urgency')
    .eq('user_id', userId)
    .eq('status', 'active')
    .lte('due_date', soon.toISOString().split('T')[0])
    .order('due_date', { ascending: true })
    .limit(5)

  deadlines?.forEach((d) => {
    const daysUntil = Math.ceil(
      (new Date(d.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    items.push(
      `${d.urgency === 'critical' ? 'CRITICAL' : 'Upcoming'}: ${d.title} — ${daysUntil <= 0 ? 'today' : `in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`}`
    )
  })

  // Analyzed documents with no action taken
  const { data: docs } = await supabase
    .from('documents')
    .select('file_name, doc_type, urgency_level')
    .eq('user_id', userId)
    .eq('status', 'analyzed')
    .order('created_at', { ascending: false })
    .limit(3)

  docs?.forEach((d) => {
    items.push(
      `Document needs action: ${d.file_name}${d.doc_type ? ` (${d.doc_type.replace('_', ' ')})` : ''}`
    )
  })

  // High-importance unresolved memories
  const { data: memories } = await supabase
    .from('memory_events')
    .select('summary')
    .eq('user_id', userId)
    .eq('is_resolved', false)
    .gte('importance', 8)
    .order('occurred_at', { ascending: false })
    .limit(3)

  memories?.forEach((m) => {
    items.push(m.summary)
  })

  return items
}

// ── getFinancialContext ───────────────────────────────────────────────────────
// Returns Mina's complete financial context for a user.
// This is injected into every AI request as structured context.

export async function getFinancialContext(
  userId: string
): Promise<FinancialContextSummary> {
  const supabase = await createServerSupabaseClient()

  // Load all context in parallel
  const [profileRes, debtsRes, memoriesRes, actionsRes, deadlinesRes, convRes] =
    await Promise.all([
      supabase
        .from('financial_profiles')
        .select('*')
        .eq('user_id', userId)
        .single(),
      supabase
        .from('debts')
        .select('*')
        .eq('user_id', userId)
        .not('status', 'in', '("paid","settled")'),
      getActiveMemories(userId, 12),
      getPendingActions(userId),
      supabase
        .from('deadlines')
        .select('due_date, urgency, status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .lte('due_date', (() => {
          const d = new Date()
          d.setDate(d.getDate() + 30)
          return d.toISOString().split('T')[0]
        })()),
      supabase
        .from('conversations')
        .select('session_summary')
        .eq('user_id', userId)
        .order('session_date', { ascending: false })
        .limit(1)
        .single(),
    ])

  const profile = profileRes.data
  const debts = debtsRes.data ?? []
  const totalDebt = debts.reduce((sum, d) => sum + (d.current_balance ?? 0), 0)
  const criticalDeadlines = deadlinesRes.data?.filter(
    (d) => d.urgency === 'critical' || d.urgency === 'high'
  ) ?? []

  const unresolvedItems = await getUnresolvedItems(userId)

  // Determine recovery stage
  const stage = determineRecoveryStage(
    totalDebt,
    profile?.pressure_level ?? 0,
    debts.length,
    profile?.total_savings ?? 0,
    profile?.monthly_income ?? 0
  )

  return {
    situation: profile?.situation ?? 'plan',
    totalDebt,
    monthlyAvailable: profile?.available_cash ?? 0,
    totalSavings: profile?.total_savings ?? 0,
    pressureLevel: profile?.pressure_level ?? 0,
    activeDebtCount: debts.length,
    pendingActionCount: actionsRes.length,
    criticalDeadlineCount: criticalDeadlines.length,
    recentMemories: memoriesRes.map((m) => m.summary),
    unresolvedItems,
    recoveryStage: stage,
    state: profile?.state ?? null,
    language: (profile?.language as Language) ?? 'en',
  }
}

// ── determineRecoveryStage ────────────────────────────────────────────────────

function determineRecoveryStage(
  totalDebt: number,
  pressureLevel: number,
  debtCount: number,
  savings: number,
  income: number
): RecoveryStage {
  if (pressureLevel >= 8 || debtCount === 0) {
    return pressureLevel >= 8 ? 'panic' : 'rebuilding'
  }
  if (savings === 0 && totalDebt > 0) return 'stabilization'
  if (savings > 0 && savings < 1000) return 'organization'
  if (income > 0 && totalDebt > 0 && savings >= 1000) return 'recovery'
  if (totalDebt === 0) return 'rebuilding'
  return 'organization'
}

// ── summarizeCurrentState ─────────────────────────────────────────────────────
// Generates a human-readable summary of what changed, what improved,
// what remains unresolved, and what should happen next.
// Used to power Mina's living dashboard briefing.

export async function summarizeCurrentState(userId: string): Promise<{
  whatChanged: string[]
  whatImproved: string[]
  whatNeedsAttention: string[]
  nextStep: string
  recoveryStage: RecoveryStage
}> {
  const supabase = await createServerSupabaseClient()
  const context = await getFinancialContext(userId)

  // Compare with last plan version
  const { data: lastPlan } = await supabase
    .from('plan_versions')
    .select('*')
    .eq('user_id', userId)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single()

  const whatChanged: string[] = []
  const whatImproved: string[] = []
  const whatNeedsAttention = context.unresolvedItems.slice(0, 4)

  if (lastPlan) {
    if (context.totalDebt < lastPlan.total_debt) {
      const reduced = lastPlan.total_debt - context.totalDebt
      whatImproved.push(`Total debt reduced by $${reduced.toLocaleString()}`)
    } else if (context.totalDebt > lastPlan.total_debt) {
      const increased = context.totalDebt - lastPlan.total_debt
      whatChanged.push(`Total debt increased by $${increased.toLocaleString()}`)
    }

    if (context.totalSavings > lastPlan.total_savings) {
      whatImproved.push(`Savings grew by $${(context.totalSavings - lastPlan.total_savings).toLocaleString()}`)
    }

    if (context.recoveryStage !== lastPlan.recovery_stage) {
      whatImproved.push(`Recovery stage moved from ${lastPlan.recovery_stage} to ${context.recoveryStage}`)
    }
  }

  // Determine next step
  let nextStep = 'Continue with your current debt plan.'

  if (context.criticalDeadlineCount > 0) {
    nextStep = 'Review your critical deadline immediately — time-sensitive action required.'
  } else if (context.unresolvedItems.length > 0) {
    nextStep = context.unresolvedItems[0]
  } else if (context.pendingActionCount > 0) {
    nextStep = 'Complete your next pending action item.'
  } else if (context.totalDebt > 0 && context.monthlyAvailable > 0) {
    nextStep = 'Apply your available monthly cash to your highest-interest debt.'
  } else if (context.totalSavings < 1000) {
    nextStep = 'Build your emergency fund to $1,000 before accelerating debt payoff.'
  }

  return {
    whatChanged,
    whatImproved,
    whatNeedsAttention,
    nextStep,
    recoveryStage: context.recoveryStage,
  }
}

// ── saveConversationSummary ───────────────────────────────────────────────────
// Called at the end of each session to store structured continuity.

export async function saveConversationSummary(
  userId: string,
  conversationId: string,
  summary: {
    topicsDiscussed: string[]
    decisionsMade: string[]
    userIntent: string
    unresolvedItems: string[]
    sessionSummary: string
    emotionalState?: string
  }
): Promise<void> {
  const supabase = await createServerSupabaseClient()

  await supabase
    .from('conversations')
    .update({
      topics_discussed: summary.topicsDiscussed,
      decisions_made: summary.decisionsMade,
      user_intent: summary.userIntent,
      unresolved_items: summary.unresolvedItems,
      session_summary: summary.sessionSummary,
      emotional_state: summary.emotionalState ?? null,
      ended_at: new Date().toISOString(),
    })
    .eq('id', conversationId)
    .eq('user_id', userId)
}

// ── snapshotPlanVersion ───────────────────────────────────────────────────────
// Save a snapshot of the user's current financial state for progress tracking.

export async function snapshotPlanVersion(
  userId: string,
  triggeredBy: string = 'auto'
): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const context = await getFinancialContext(userId)

  // Get current version count
  const { count } = await supabase
    .from('plan_versions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  await supabase.from('plan_versions').insert({
    user_id: userId,
    version_number: (count ?? 0) + 1,
    total_debt: context.totalDebt,
    total_savings: context.totalSavings,
    monthly_available: context.monthlyAvailable,
    debt_count: context.activeDebtCount,
    recovery_stage: context.recoveryStage,
    pressure_level: context.pressureLevel,
    triggered_by: triggeredBy,
  })
}
