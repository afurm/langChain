import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { lessonId, question, userAnswer, topic } = await request.json();

    const prompt = `As a language learning assistant, provide a helpful hint for the following:
    ${topic ? `Topic: ${topic}` : ''}
    ${question ? `Question: ${question}` : ''}
    ${userAnswer ? `User's answer: ${userAnswer}` : ''}
    
    Provide a concise, encouraging hint that helps the user understand their mistake or reinforces the correct concept.
    Keep the response under 100 words and focus on one key point.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    const hint = response.choices[0].message.content;

    return NextResponse.json({ hint });
  } catch (error) {
    console.error('Error generating hint:', error);
    return NextResponse.json(
      { error: 'Failed to generate hint' },
      { status: 500 }
    );
  }
} 