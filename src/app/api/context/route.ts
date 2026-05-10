// app/api/context/route.ts

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { summarizeCurrentState, getFinancialContext } from '@/lib/memory'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [context, summary] = await Promise.all([
      getFinancialContext(user.id),
      summarizeCurrentState(user.id),
    ])

    return NextResponse.json({ context, summary })
  } catch (error) {
    console.error('Context API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
