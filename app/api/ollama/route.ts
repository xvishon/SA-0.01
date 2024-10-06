import { NextResponse } from 'next/server';

const OLLAMA_BASE_URL = 'http://localhost:11434';

// Mock data for fallback
const MOCK_MODELS = ['gpt-3.5-turbo', 'gpt-4', 'llama2'];
const MOCK_GENERATE_RESPONSE = {
  model: "gpt-3.5-turbo",
  created_at: "2023-11-04T12:34:56Z",
  response: "This is a mock response from the AI model.",
  done: true,
  context: [1, 2, 3, 4, 5],
  total_duration: 1000000000,
  load_duration: 500000000,
  prompt_eval_count: 10,
  prompt_eval_duration: 100000000,
  eval_count: 20,
  eval_duration: 400000000
};

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
    
    // Fallback to mock data if Ollama is not available
    if (url.includes('/api/tags')) {
      console.log('Falling back to mock models data');
      return NextResponse.json({ models: MOCK_MODELS });
    } else if (url.includes('/api/generate')) {
      console.log('Falling back to mock generate response');
      return NextResponse.json(MOCK_GENERATE_RESPONSE);
    }
    
    return NextResponse.json({ error: 'Ollama is not available' }, { status: 503 });
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