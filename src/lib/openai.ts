import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Section {
  title: string;
  content: string;
}

export interface LessonContent {
  title: string;
  sections: Section[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export async function generateLesson(
  difficulty: number,
  topic: string
): Promise<LessonContent> {
  try {
    const prompt = `Create a language learning lesson about "${topic}" at difficulty level ${difficulty} (1-5).
    The response should be in JSON format with the following structure:
    {
      "title": "Lesson title",
      "sections": [
        {
          "title": "Section title",
          "content": "Section content in markdown format"
        }
      ],
      "quiz": [
        {
          "question": "Question text",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctIndex": 0
        }
      ]
    }
    Include 3-5 sections and 3-5 quiz questions.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = JSON.parse(response.choices[0].message.content || '{}');
    return content;
  } catch (error) {
    console.error('Error generating lesson:', error);
    throw new Error('Failed to generate lesson content');
  }
}

export async function generateFeedback(
  userAnswer: string,
  correctAnswer: string,
  difficulty: number
): Promise<string> {
  try {
    const prompt = `The user answered "${userAnswer}" to a question where the correct answer was "${correctAnswer}".
    The difficulty level is ${difficulty} (1-5).
    Provide brief, encouraging feedback explaining why the answer was ${
      userAnswer === correctAnswer ? 'correct' : 'incorrect'
    }.
    Keep the response under 100 words.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw new Error('Failed to generate feedback');
  }
} 