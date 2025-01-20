import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface LessonContent {
  title: string;
  content: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export async function generateLesson(
  difficulty: 1 | 2 | 3,
  topic?: string
): Promise<LessonContent> {
  const difficultyLevel = ['beginner', 'intermediate', 'advanced'][difficulty - 1];
  const prompt = `Create an English language learning lesson for ${difficultyLevel} level students.
${topic ? `The lesson should focus on: ${topic}` : ''}

The response should be in JSON format with the following structure:
{
  "title": "Lesson title",
  "content": "Main lesson content with examples and explanations",
  "quiz": [
    {
      "question": "Quiz question",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctIndex": 0
    }
  ]
}

The content should be engaging and include:
- Clear explanations
- Practical examples
- Common usage scenarios
- Tips for remembering
Generate 3 quiz questions to test understanding.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
    response_format: { type: "json_object" },
  });

  const response = completion.choices[0].message.content;
  if (!response) {
    throw new Error('Failed to generate lesson content');
  }

  return JSON.parse(response) as LessonContent;
}

export async function generateFeedback(
  answer: string,
  correctAnswer: string,
  difficulty: 1 | 2 | 3
): Promise<string> {
  const difficultyLevel = ['beginner', 'intermediate', 'advanced'][difficulty - 1];
  
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `As an English language teacher, provide feedback for a ${difficultyLevel} level student.
Student's answer: "${answer}"
Correct answer: "${correctAnswer}"

Provide constructive feedback that:
1. Acknowledges what was done correctly
2. Identifies any mistakes
3. Explains why the correct answer is better
4. Gives a helpful tip for improvement

Keep the response concise and encouraging.`
      }
    ],
    model: "gpt-4-turbo-preview",
  });

  return completion.choices[0].message.content || 'No feedback available';
} 