import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch from local model' }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json(data);
}

