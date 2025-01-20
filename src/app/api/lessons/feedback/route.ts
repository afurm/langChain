import { NextRequest, NextResponse } from 'next/server';
import { generateFeedback } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { answer, correctAnswer, difficulty } = await req.json();
    
    if (!answer || !correctAnswer || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (difficulty < 1 || difficulty > 3) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }

    const feedback = await generateFeedback(answer, correctAnswer, difficulty);
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error generating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback' },
      { status: 500 }
    );
  }
} 