import { NextRequest, NextResponse } from 'next/server';
import { generateLesson } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { difficulty, topic } = await req.json();
    
    if (!difficulty || difficulty < 1 || difficulty > 3) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }

    const lesson = await generateLesson(difficulty, topic);
    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error generating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to generate lesson' },
      { status: 500 }
    );
  }
} 