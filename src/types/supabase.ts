// This file will be replaced when you run:
// npx supabase gen types typescript --project-id dmdvoygnzbosjbwsriea > src/types/supabase.ts

export type Database = {
  public: {
    Tables: {
      financial_profiles: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      debts: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      documents: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      memory_events: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      action_items: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      deadlines: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      conversations: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      plan_versions: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      chat_history: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
    }
  }
}
