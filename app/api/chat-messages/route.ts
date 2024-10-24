import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    inputs,
    query,
    files,
    conversation_id: conversationId, // Pega o conversation_id do payload
    response_mode: responseMode,
  } = body

  console.log('Conversation ID:', conversationId) // Exibe o conversation_id no console

  const { user } = getInfo(request)
  const res = await client.createChatMessage(inputs, query, user, responseMode, conversationId, files)

  // Retorna o conversationId junto com a resposta
  return new Response(JSON.stringify({ data: res.data, conversationId }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
