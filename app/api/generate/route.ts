import { NextResponse } from 'next/server';

const OLLAMA_BASE_URL = 'http://localhost:11434';

export async function POST(request: Request) {
    try {
        const { model, prompt } = await request.json();

        if (!model || !prompt) {
            return NextResponse.json({ error: 'Model and prompt are required.' }, { status: 400 });
        }

        // Send the request to Ollama's API directly
        const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, prompt }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ollama API error:', response.status, errorText);
            return NextResponse.json({ error: 'Failed to generate response from Ollama.' }, { status: response.status });
        }

        // Stream the AI-generated text back to the client
        return new Response(response.body, {
            headers: { 'Content-Type': 'text/event-stream' },
           status: response.status,
        });
    } catch (error) {
        console.error('Error generating AI response:', error);
        return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
    }
}
