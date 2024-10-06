import { NextResponse } from 'next/server';

const OLLAMA_BASE_URL = 'http://localhost:11434';

async function proxyRequest(url: string, method: string, body?: any) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}${url}`, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request to Ollama:', error);
    return NextResponse.json({ error: `Failed to communicate with Ollama: ${error.message}` }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '/api/tags';
  return proxyRequest(path, 'GET');
}

export async function POST(request: Request) {
  const body = await request.json();
  return proxyRequest('/api/generate', 'POST', body);
}