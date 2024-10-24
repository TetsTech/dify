import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function POST(request: NextRequest, { params }: {
  params: { conversationId: string }
}) {
  // Lidar com preflight request para CORS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://humanauniversity.ai', // O domínio do seu site WordPress
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  // Processar a requisição principal
  const body = await request.json()
  const { auto_generate, name } = body
  const { conversationId } = params

  // Mostrar o conversationId no console
  console.log('Conversation ID:', conversationId);

  const { user } = getInfo(request)

  // Auto gerar nome
  const { data } = await client.renameConversation(conversationId, name, user, auto_generate)

  // Responder com os cabeçalhos CORS corretos
  const response = NextResponse.json(data)
  response.headers.set('Access-Control-Allow-Origin', 'https://humanauniversity.ai') // O domínio que poderá acessar
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return response
}
