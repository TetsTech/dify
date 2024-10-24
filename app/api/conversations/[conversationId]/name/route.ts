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
        'Access-Control-Allow-Origin': 'https://humanauniversity.ai', // Substitua pelo domínio permitido
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  // Processar a requisição principal
  const body = await request.json()
  const { auto_generate, name } = body
  const { conversationId } = params // Mantenha isso se ainda precisar do ID da URL

  // Mostrar o conversationId no console sempre que a API for chamada
  console.log('Conversation ID:', conversationId);

  const { user } = getInfo(request)

  // Auto gerar nome
  const { data } = await client.renameConversation(conversationId, name, user, auto_generate)

  // Pegar conversationIdInfo do localStorage (isso é feito no lado do cliente, não no servidor)
  let conversationIdInfo;
  if (typeof window !== 'undefined') {
    conversationIdInfo = localStorage.getItem('conversationIdInfo'); // Pega o valor do localStorage
  }

  // Adiciona o conversationIdInfo na resposta para o outro domínio
  const responseData = {
    ...data,
    conversationIdInfo,  // Incluir o conversationIdInfo na resposta JSON
  }

  // Enviar o conversationIdInfo para a janela pai usando postMessage
  if (typeof window !== 'undefined' && conversationIdInfo) {
    window.parent.postMessage({ conversationIdInfo }, 'https://humanauniversity.ai'); // Substitua pelo domínio do WordPress
  }

  // Responder com os cabeçalhos CORS corretos
  const response = NextResponse.json(responseData)
  response.headers.set('Access-Control-Allow-Origin', 'https://humanauniversity.ai') // Substitua pelo domínio externo
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return response
}
