export enum QuizType {
  MultipleChoice = 'multiple_choice',
  FillInBlank = 'fill_in_blank',
  TrueFalse = 'true_false',
  ErrorCorrection = 'error_correction',
  Matching = 'matching',
  Sorting = 'sorting',
  ClozePassage = 'cloze_passage',
  Reordering = 'reordering',
  AudioBased = 'audio_based',
  Speaking = 'speaking',
  ShortAnswer = 'short_answer'
}

export interface Question {
  type: QuizType;
  question: string;
  options?: string[];
  correctIndex?: number;
  hint?: string;
  // Fill-in-the-blank
  answer?: string;
  // True/False
  isTrue?: boolean;
  explanation?: string;
  // Error Correction
  incorrectText?: string;
  correctText?: string;
  // Matching/Pairing
  pairs?: { left: string; right: string }[];
  // Sorting/Categorizing
  categories?: { [key: string]: string[] };
  // Cloze Passages
  text?: string;
  blanks?: string[];
  // Reordering/Sequencing
  sequence?: string[];
  // Audio-based
  audioUrl?: string;
  // Speaking/Pronunciation
  targetPhrase?: string;
  phonetics?: string;
  // Short-Answer
  keywords?: string[];
  sampleAnswer?: string;
} 