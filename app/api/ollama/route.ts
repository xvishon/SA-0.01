import { NextResponse } from 'next/server';

const OLLAMA_BASE_URL = 'http://localhost:11434';

async function proxyRequest(url: string, method: string, body?: unknown) {
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
  } catch (error: unknown) {
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error proxying request to Ollama:', errorMessage);
    return NextResponse.json({ error: `Failed to communicate with Ollama: ${errorMessage}` }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/api/tags';
    return proxyRequest(path, 'GET');
  } catch (error: unknown) {
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: `Failed to handle GET request: ${errorMessage}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return proxyRequest('/api/generate', 'POST', body);
  } catch (error: unknown) {
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: `Failed to handle POST request: ${errorMessage}` }, { status: 500 });
  }
}
