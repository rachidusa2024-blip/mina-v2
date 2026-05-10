// ─────────────────────────────────────────────────────────────────────────────
// MINA — DATABASE TYPES
// Generated from Supabase schema
// ─────────────────────────────────────────────────────────────────────────────

export type Language = 'en' | 'es'
export type IncomeType = 'stable' | 'variable' | 'freelance'
export type Situation = 'collectors' | 'legal' | 'medical' | 'irs' | 'payday' | 'plan' | 'savings'
export type CreditHealth = 'excellent' | 'fair' | 'poor' | 'none'
export type RecoveryStage = 'panic' | 'stabilization' | 'organization' | 'recovery' | 'rebuilding'

export type DebtStatus = 'active' | 'negotiating' | 'settled' | 'paid' | 'disputed' | 'in_collection' | 'legal'
export type DebtType = 'credit_card' | 'medical' | 'personal_loan' | 'payday' | 'student' | 'car' | 'irs' | 'collection' | 'other'
export type SettlementStatus = 'none' | 'offered' | 'accepted' | 'rejected'

export type DocType = 'collection_letter' | 'medical_bill' | 'irs_notice' | 'court_notice' | 'loan_statement' | 'other'
export type DocStatus = 'uploaded' | 'analyzed' | 'action_taken' | 'resolved'
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical'

export type MemoryEventType = 'fear' | 'preference' | 'behavior' | 'decision' | 'upload' | 'deadline' | 'concern' | 'progress' | 'goal' | 'change'
export type MemoryCategory = 'emotional' | 'financial' | 'legal' | 'behavioral' | 'contextual'

export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'overdue'
export type ActionPriority = 'low' | 'medium' | 'high' | 'critical'
export type ActionCategory = 'communication' | 'document' | 'payment' | 'review' | 'call' | 'deadline' | 'legal'

export type DeadlineType = 'court_date' | 'irs_response' | 'payment' | 'collector_response' | 'statute' | 'other'
export type DeadlineStatus = 'active' | 'completed' | 'missed' | 'irrelevant'

export type EmotionalState = 'calm' | 'anxious' | 'overwhelmed' | 'hopeful' | 'frustrated'
export type ChatRole = 'user' | 'assistant'

// ─────────────────────────────────────────────────────────────────────────────
// TABLE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface FinancialProfile {
  id: string
  user_id: string
  state: string | null
  language: Language
  monthly_income: number
  income_type: IncomeType
  side_income: number
  monthly_expenses: number
  available_cash: number
  total_savings: number
  emergency_fund: number
  situation: Situation | null
  urgency: string | null
  primary_goal: string | null
  future_goal: string | null
  credit_health: CreditHealth | null
  pressure_level: number
  created_at: string
  updated_at: string
}

export interface Debt {
  id: string
  user_id: string
  creditor_name: string | null
  collector_name: string | null
  debt_type: DebtType | null
  original_balance: number
  current_balance: number
  interest_rate: number
  minimum_payment: number
  status: DebtStatus
  missed_payments: number
  last_payment_date: string | null
  due_date: string | null
  in_collections: boolean
  collector_violations: string[] | null
  statute_expired: boolean
  settlement_offered: number | null
  settlement_status: SettlementStatus | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  file_name: string
  file_url: string | null
  file_type: string | null
  doc_type: DocType | null
  extracted_text: string | null
  analysis_summary: string | null
  identified_issues: string[] | null
  response_deadline: string | null
  payment_deadline: string | null
  urgency_level: UrgencyLevel
  related_debt_id: string | null
  status: DocStatus
  action_taken: string | null
  created_at: string
  updated_at: string
}

export interface MemoryEvent {
  id: string
  user_id: string
  event_type: MemoryEventType
  category: MemoryCategory | null
  summary: string
  detail: string | null
  is_resolved: boolean
  importance: number
  related_debt_id: string | null
  related_doc_id: string | null
  occurred_at: string
  expires_at: string | null
  created_at: string
}

export interface ActionItem {
  id: string
  user_id: string
  title: string
  description: string | null
  category: ActionCategory | null
  status: ActionStatus
  priority: ActionPriority
  due_date: string | null
  completed_at: string | null
  related_debt_id: string | null
  related_doc_id: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface Deadline {
  id: string
  user_id: string
  title: string
  description: string | null
  deadline_type: DeadlineType | null
  due_date: string
  reminder_days: number[]
  urgency: UrgencyLevel
  is_expired: boolean
  related_debt_id: string | null
  related_doc_id: string | null
  related_action_id: string | null
  status: DeadlineStatus
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  user_id: string
  session_date: string
  topics_discussed: string[] | null
  decisions_made: string[] | null
  user_intent: string | null
  unresolved_items: string[] | null
  session_summary: string | null
  emotional_state: EmotionalState | null
  messages: ChatMessage[]
  started_at: string
  ended_at: string | null
  created_at: string
}

export interface PlanVersion {
  id: string
  user_id: string
  version_number: number
  snapshot_date: string
  total_debt: number
  total_savings: number
  monthly_available: number
  debt_count: number
  debt_eliminated: number
  savings_gained: number
  pressure_level: number
  projected_debt_free_date: string | null
  recovery_stage: RecoveryStage | null
  notes: string | null
  triggered_by: string | null
  created_at: string
}

export interface ChatHistory {
  id: string
  user_id: string
  conversation_id: string | null
  role: ChatRole
  content: string
  has_document: boolean
  has_letter: boolean
  created_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: ChatRole
  content: string
}

// The full financial context Mina uses to generate responses
export interface MinaContext {
  profile: FinancialProfile | null
  debts: Debt[]
  recentDocuments: Document[]
  activeMemories: MemoryEvent[]
  pendingActions: ActionItem[]
  upcomingDeadlines: Deadline[]
  unresolvedItems: string[]
  lastConversationSummary: string | null
  recoveryStage: RecoveryStage
  totalDebt: number
  monthlyAvailable: number
  daysUntilNextDeadline: number | null
}

// What getFinancialContext returns — used to build Mina's system prompt
export interface FinancialContextSummary {
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
  recoveryStage: RecoveryStage
  state: string | null
  language: Language
}
