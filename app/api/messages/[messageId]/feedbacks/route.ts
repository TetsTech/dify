import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { client, getInfo } from '@/app/api/utils/common';

// Expor conversationId em uma API pública
export async function POST(request: NextRequest, { params }: {
  params: { messageId: string }
}) {
  // Verificar o método OPTIONS para CORS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://humanauniversity.ai', // Domínio do seu WordPress
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400', // Cache da preflight request por 24 horas
      },
    });
  }

  const body = await request.json();
  const { rating } = body;
  const { messageId } = params;
  const { user } = getInfo(request);

  // Requisição ao client para pegar feedback e conversationId
  const { data } = await client.messageFeedback(messageId, rating, user);

  // Retornar dados com cabeçalhos CORS configurados
  const response = NextResponse.json({
    conversationId: data.conversationId, // Expor conversationId aqui
    feedback: data.feedback,
  });

  // Definir os cabeçalhos CORS necessários
  response.headers.set('Access-Control-Allow-Origin', 'https://humanauniversity.ai'); // Permitir WordPress acessar
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}
