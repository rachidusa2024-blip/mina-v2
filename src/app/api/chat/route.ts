// app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getFinancialContext, saveMemoryEvent, createActionItem } from '@/lib/memory'
import { buildMinaSystemPrompt } from '@/lib/prompt'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!

export async function POST(request: NextRequest) {
  try {
    // Authenticate
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { message, conversationId, history = [] } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // Get live financial context — this is what makes Mina remember
    const context = await getFinancialContext(user.id)
    const systemPrompt = buildMinaSystemPrompt(context, context.language)

    // Save user message to chat history
    const { data: savedMsg } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.id,
        conversation_id: conversationId ?? null,
        role: 'user',
        content: message,
      })
      .select()
      .single()

    // Build message history for context window
    const messages = [
      ...history.slice(-12).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    // Call Anthropic
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic error:', response.status, err)
      return NextResponse.json(
        { error: 'AI service unavailable' },
        { status: 502 }
      )
    }

    const aiData = await response.json()
    const reply = aiData.content?.[0]?.text ?? 'Something went wrong. Please try again.'

    // Save assistant response
    await supabase.from('chat_history').insert({
      user_id: user.id,
      conversation_id: conversationId ?? null,
      role: 'assistant',
      content: reply,
      has_letter: /Dear Sir|Dear Madam|Sincerely,/i.test(reply),
    })

    // Auto-extract memory events from conversation
    await extractAndSaveMemory(user.id, message, reply)

    return NextResponse.json({
      response: reply,
      context: {
        recoveryStage: context.recoveryStage,
        unresolvedCount: context.unresolvedItems.length,
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ── Auto-extract memory from conversation ─────────────────────────────────────
// Detects important signals in the conversation and saves them as memories.
// This is what makes Mina remember without the user having to tell her twice.

async function extractAndSaveMemory(
  userId: string,
  userMessage: string,
  minaReply: string
): Promise<void> {
  const msg = userMessage.toLowerCase()

  // Fear patterns
  if (msg.includes('afraid') || msg.includes('scared') || msg.includes('terrified') || msg.includes('fear')) {
    if (msg.includes('call') || msg.includes('phone') || msg.includes('collector')) {
      await saveMemoryEvent(
        userId, 'fear', 'emotional',
        'User expressed fear about answering collection calls', 8
      )
    }
    if (msg.includes('court') || msg.includes('lawsuit') || msg.includes('sue')) {
      await saveMemoryEvent(
        userId, 'fear', 'emotional',
        'User expressed fear about legal action', 9
      )
    }
  }

  // Decision patterns
  if (msg.includes('going to') || msg.includes('will send') || msg.includes('decided to')) {
    if (msg.includes('letter') || msg.includes('dispute') || msg.includes('validation')) {
      await saveMemoryEvent(
        userId, 'decision', 'behavioral',
        'User decided to send a written letter to creditor or collector', 9
      )
      await createActionItem(userId, 'Send written letter to creditor', {
        category: 'communication',
        priority: 'high',
      })
    }
  }

  // Ignored or avoided patterns
  if (msg.includes('ignore') || msg.includes('avoided') || msg.includes('didn\'t open') || msg.includes('threw away')) {
    if (msg.includes('notice') || msg.includes('letter') || msg.includes('mail') || msg.includes('summons')) {
      await saveMemoryEvent(
        userId, 'behavior', 'behavioral',
        'User mentioned avoiding or ignoring financial mail or notices', 8
      )
    }
  }

  // Income instability
  if (msg.includes('freelance') || msg.includes('variable') || msg.includes('irregular') || msg.includes('unpredictable')) {
    if (msg.includes('income') || msg.includes('money') || msg.includes('pay')) {
      await saveMemoryEvent(
        userId, 'preference', 'financial',
        'User has variable or freelance income — plan should stay flexible', 7
      )
    }
  }

  // Preference for savings first
  if ((msg.includes('emergency') || msg.includes('savings')) && msg.includes('first')) {
    await saveMemoryEvent(
      userId, 'preference', 'financial',
      'User prefers building emergency savings before aggressive debt payoff', 7
    )
  }
}
