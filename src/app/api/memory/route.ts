// app/api/memory/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { saveMemoryEvent, getActiveMemories, resolveMemoryEvent } from '@/lib/memory'
import type { MemoryEventType, MemoryCategory } from '@/types/database'

// GET — retrieve active memories
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const memories = await getActiveMemories(user.id)
    return NextResponse.json({ memories })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST — save a new memory event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { eventType, category, summary, importance, detail } = body

    if (!eventType || !summary) {
      return NextResponse.json({ error: 'eventType and summary required' }, { status: 400 })
    }

    const memory = await saveMemoryEvent(
      user.id,
      eventType as MemoryEventType,
      category as MemoryCategory,
      summary,
      importance ?? 5,
      { detail }
    )

    return NextResponse.json({ memory })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH — resolve a memory event
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { memoryId } = body
    if (!memoryId) return NextResponse.json({ error: 'memoryId required' }, { status: 400 })

    await resolveMemoryEvent(user.id, memoryId)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
