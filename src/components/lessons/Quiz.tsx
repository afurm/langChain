'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useHints } from '@/hooks/useHints';
import { Question, QuizType } from '@/types/quiz';

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    length: number;
    item(index: number): {
      item(index: number): {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface QuizProps {
  questions: Question[];
  onComplete: (score: number) => void;
  lessonId?: number;
  topic?: string;
}

export default function Quiz({ questions, onComplete, lessonId, topic }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const { getHint, loading: loadingHint } = useHints();

  // State for Matching component
  const [selectedPairIndex, setSelectedPairIndex] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);

  // State for ClozePassage component
  const [blankAnswers, setBlankAnswers] = useState<string[]>([]);
  const [blankStatuses, setBlankStatuses] = useState<boolean[]>([]);

  // State for Sorting component
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [sortedItems, setSortedItems] = useState<{ [key: string]: string[] }>({});

  // State for Reordering component
  const [reorderItems, setReorderItems] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // State for Speaking component
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);

  // Reset states when question changes
  useEffect(() => {
    setSelectedPairIndex(null);
    setMatchedPairs([]);
    setBlankAnswers([]);
    setBlankStatuses([]);
    setDraggedItem(null);
    setSortedItems({});
    setReorderItems(questions[currentQuestion].sequence || []);
    setDraggedIndex(null);
    setTranscript('');
    setError(null);
    setVolume(0);
  }, [currentQuestion, questions]);

  // Initialize ClozePassage blanks
  useEffect(() => {
    const question = questions[currentQuestion];
    if (question.type === QuizType.ClozePassage && question.blanks) {
      setBlankAnswers(new Array(question.blanks.length).fill(''));
      setBlankStatuses(new Array(question.blanks.length).fill(false));
    }
  }, [currentQuestion, questions]);

  // Initialize Sorting items
  useEffect(() => {
    const question = questions[currentQuestion];
    if (question.type === QuizType.Sorting && question.categories) {
      const allItems = Object.values(question.categories).flat();
      setSortedItems({ 'Unsorted': allItems });
    }
  }, [currentQuestion, questions]);

  const handleAnswer = useCallback(async (isCorrect: boolean) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setHint(null);
    } else {
      setShowResults(true);
      const finalScore = ((score + (isCorrect ? 1 : 0)) / questions.length) * 100;
      onComplete(finalScore);
    }

    setIsSubmitting(false);
  }, [currentQuestion, isSubmitting, onComplete, questions.length, score]);

  const handleGetHint = useCallback(async () => {
    const currentQuestionData = questions[currentQuestion];
    const hint = await getHint({
      lessonId,
      question: currentQuestionData.question,
      userAnswer: currentQuestionData.options && selectedAnswer !== null ? currentQuestionData.options[selectedAnswer] : undefined,
      topic,
    });
    setHint(hint);
  }, [currentQuestion, getHint, lessonId, questions, selectedAnswer, topic]);

  const handlePairSelect = useCallback((index: number, isRight: boolean) => {
    if (selectedAnswer !== null || matchedPairs.includes(index)) return;

    if (selectedPairIndex === null) {
      setSelectedPairIndex(index);
    } else {
      const isCorrect = selectedPairIndex === index;
      if (isCorrect) {
        setMatchedPairs(prev => [...prev, index]);
        const question = questions[currentQuestion];
        if (matchedPairs.length + 1 === (question.pairs?.length || 0)) {
          handleAnswer(true);
          setSelectedAnswer(0);
        }
      }
      setSelectedPairIndex(null);
    }
  }, [currentQuestion, handleAnswer, matchedPairs, questions, selectedAnswer, selectedPairIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>, index: number, isRight: boolean) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePairSelect(index, isRight);
    }
  }, [handlePairSelect]);

  const currentQuestionData = useMemo(() => questions[currentQuestion], [currentQuestion, questions]);

  const progressPercentage = useMemo(() => 
    Math.round((currentQuestion / questions.length) * 100),
    [currentQuestion, questions.length]
  );

  const finalScore = useMemo(() => 
    Math.round((score / questions.length) * 100),
    [score, questions.length]
  );

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const draggedOverItem = e.currentTarget;
    draggedOverItem.classList.add('bg-blue-500/20', 'border', 'border-blue-500');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    const draggedOverItem = e.currentTarget;
    draggedOverItem.classList.remove('bg-blue-500/20', 'border', 'border-blue-500');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const draggedOverItem = e.currentTarget;
    draggedOverItem.classList.remove('bg-blue-500/20', 'border', 'border-blue-500');

    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const newItems = [...reorderItems];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(dropIndex, 0, draggedItem);
      setReorderItems(newItems);
    }
    setDraggedIndex(null);
  };

  const handleBlankChange = (index: number, value: string) => {
    setBlankAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const handleBlankSubmit = (index: number) => {
    const question = questions[currentQuestion];
    if (!question.blanks?.[index]) return;
    
    const isCorrect = blankAnswers[index].trim().toLowerCase() === question.blanks[index].toLowerCase();
    setBlankStatuses(prev => {
      const newStatuses = [...prev];
      newStatuses[index] = isCorrect;
      return newStatuses;
    });

    // Check if all blanks are filled and correct
    const allFilled = blankAnswers.every(answer => answer.trim() !== '');
    const allCorrect = blankStatuses.every(status => status);
    if (allFilled && allCorrect) {
      handleAnswer(true);
      setSelectedAnswer(0);
    }
  };

  const handleShortAnswerSubmit = () => {
    const question = questions[currentQuestion];
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea || !question.keywords?.length) return;

    const answer = textarea.value.trim().toLowerCase();
    const isCorrect = question.keywords.some(keyword => 
      answer.includes(keyword.toLowerCase())
    );
    handleAnswer(isCorrect);
    setSelectedAnswer(0);
  };

  const handleSortingCheck = () => {
    const question = questions[currentQuestion];
    if (!question.categories) return;

    // Check if all items are sorted
    const unsortedCount = sortedItems['Unsorted']?.length || 0;
    if (unsortedCount > 0) return;

    // Check if items are in correct categories
    const isCorrect = Object.entries(question.categories).every(([category, items]) => {
      const sortedInCategory = sortedItems[category] || [];
      return items.length === sortedInCategory.length && 
             items.every(item => sortedInCategory.includes(item));
    });

    handleAnswer(isCorrect);
    setSelectedAnswer(0);

    // Show results
    Object.entries(question.categories).forEach(([category, correctItems]) => {
      const sortedInCategory = sortedItems[category] || [];
      const categoryEl = document.querySelector(`[data-category="${category}"]`);
      if (categoryEl) {
        if (correctItems.length === sortedInCategory.length && 
            correctItems.every(item => sortedInCategory.includes(item))) {
          categoryEl.classList.add('bg-green-500/20', 'border-green-500', 'border');
        } else {
          categoryEl.classList.add('bg-red-500/20', 'border-red-500', 'border');
        }
      }
    });
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];

    switch (question.type) {
      case QuizType.MultipleChoice:
        return (
          <div className="space-y-3" role="radiogroup" aria-label="Multiple choice options">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.correctIndex !== undefined && index === question.correctIndex)}
                disabled={isSubmitting || selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  selectedAnswer === null
                    ? 'bg-gray-700/50 hover:bg-gray-700'
                    : selectedAnswer === index
                    ? index === question.correctIndex
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-red-500/20 border-red-500'
                    : index === question.correctIndex
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-gray-700/50'
                } ${
                  selectedAnswer === null ? 'border-transparent' : 'border'
                }`}
                role="radio"
                aria-checked={selectedAnswer === index}
                aria-disabled={isSubmitting || selectedAnswer !== null}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedAnswer !== null && (
                    index === question.correctIndex ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" aria-label="Correct answer" />
                    ) : selectedAnswer === index ? (
                      <XCircleIcon className="w-5 h-5 text-red-500" aria-label="Incorrect answer" />
                    ) : null
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case QuizType.FillInBlank:
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Type your answer..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting || selectedAnswer !== null}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isSubmitting && selectedAnswer === null) {
                  const input = e.target as HTMLInputElement;
                  handleAnswer(input.value.trim().toLowerCase() === question.answer?.toLowerCase());
                  setSelectedAnswer(0);
                }
              }}
              aria-label="Fill in the blank answer"
              aria-disabled={isSubmitting || selectedAnswer !== null}
            />
            {selectedAnswer !== null && (
              <div 
                className={`p-4 rounded-lg ${question.answer?.toLowerCase() === (document.querySelector('input') as HTMLInputElement)?.value.trim().toLowerCase() ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'} border`}
                role="alert"
              >
                <p>Correct answer: {question.answer}</p>
              </div>
            )}
          </div>
        );

      case QuizType.ErrorCorrection:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="font-mono">{question.incorrectText}</p>
            </div>
            <input
              type="text"
              placeholder="Type the corrected version..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting || selectedAnswer !== null}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isSubmitting && selectedAnswer === null) {
                  const input = e.target as HTMLInputElement;
                  handleAnswer(input.value.trim().toLowerCase() === question.correctText?.toLowerCase());
                  setSelectedAnswer(0);
                }
              }}
            />
            {selectedAnswer !== null && (
              <div className={`p-4 rounded-lg ${question.correctText?.toLowerCase() === (document.querySelector('input') as HTMLInputElement)?.value.trim().toLowerCase() ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'} border`}>
                <p>Correct version: {question.correctText}</p>
              </div>
            )}
          </div>
        );

      case QuizType.Matching:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {question.pairs?.map((pair, index) => (
                  <div
                    key={`left-${index}`}
                    role="button"
                    tabIndex={0}
                    className={`p-3 rounded-lg transition-all ${
                      matchedPairs.includes(index)
                        ? 'bg-green-500/20 border-green-500 border'
                        : selectedPairIndex === index
                        ? 'bg-blue-500/20 border-blue-500 border'
                        : 'bg-gray-700/50 hover:bg-gray-600/50 cursor-pointer'
                    }`}
                    onClick={() => handlePairSelect(index, false)}
                    onKeyDown={(e) => handleKeyDown(e, index, false)}
                    aria-label={`Match item: ${pair.left}`}
                    aria-pressed={selectedPairIndex === index}
                    aria-disabled={matchedPairs.includes(index)}
                  >
                    {pair.left}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {question.pairs?.map((pair, index) => (
                  <div
                    key={`right-${index}`}
                    role="button"
                    tabIndex={0}
                    className={`p-3 rounded-lg transition-all ${
                      matchedPairs.includes(index)
                        ? 'bg-green-500/20 border-green-500 border'
                        : selectedPairIndex === index
                        ? 'bg-blue-500/20 border-blue-500 border'
                        : 'bg-gray-700/50 hover:bg-gray-600/50 cursor-pointer'
                    }`}
                    onClick={() => handlePairSelect(index, true)}
                    onKeyDown={(e) => handleKeyDown(e, index, true)}
                    aria-label={`Match with: ${pair.right}`}
                    aria-pressed={selectedPairIndex === index}
                    aria-disabled={matchedPairs.includes(index)}
                  >
                    {pair.right}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-400 text-center">
              Click or use Enter/Space to select matching pairs. Use Tab to navigate between items.
            </p>
            {selectedAnswer !== null && matchedPairs.length < (question.pairs?.length || 0) && (
              <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-red-400">Not all pairs were matched correctly. Try again!</p>
              </div>
            )}
          </div>
        );

      case QuizType.ClozePassage:
        return (
          <div className="space-y-4">
            <div className="prose prose-invert max-w-none">
              {question.text?.split('_____').map((part, index, array) => (
                <span key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <div className="inline-block relative">
                      <input
                        type="text"
                        value={blankAnswers[index] || ''}
                        onChange={(e) => handleBlankChange(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isSubmitting && selectedAnswer === null) {
                            handleBlankSubmit(index);
                          }
                        }}
                        className={`w-32 mx-1 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          blankStatuses[index] !== undefined
                            ? blankStatuses[index]
                              ? 'bg-green-500/20 border-green-500'
                              : 'bg-red-500/20 border-red-500'
                            : 'bg-gray-700/50 border-gray-600'
                        }`}
                        disabled={isSubmitting || selectedAnswer !== null || blankStatuses[index]}
                      />
                      <button
                        onClick={() => handleBlankSubmit(index)}
                        disabled={isSubmitting || selectedAnswer !== null || blankStatuses[index] || !blankAnswers[index]}
                        className="absolute right-0 top-0 bottom-0 px-2 text-sm bg-blue-500 hover:bg-blue-600 rounded-r transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ✓
                      </button>
                      {blankStatuses[index] !== undefined && (
                        <div className="absolute left-0 right-8 -bottom-6 text-xs">
                          {blankStatuses[index] ? (
                            <span className="text-green-500">Correct!</span>
                          ) : (
                            <span className="text-red-500">Try again</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </span>
              ))}
            </div>

            {selectedAnswer !== null && (
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <p className="font-medium mb-2">Correct answers:</p>
                <ol className="list-decimal list-inside">
                  {question.blanks?.map((blank, index) => (
                    <li key={index} className={blankStatuses[index] ? 'text-green-500' : ''}>
                      {blank}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        );

      case QuizType.TrueFalse:
        return (
          <div className="space-y-3">
            {['True', 'False'].map((option, index) => (
              <button
                key={option}
                onClick={() => handleAnswer(question.isTrue !== undefined && (index === 0 ? question.isTrue : !question.isTrue))}
                disabled={isSubmitting || selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  selectedAnswer === null
                    ? 'bg-gray-700/50 hover:bg-gray-700'
                    : selectedAnswer === index
                    ? (index === 0 ? question.isTrue : !question.isTrue)
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-red-500/20 border-red-500'
                    : (index === 0 ? question.isTrue : !question.isTrue)
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-gray-700/50'
                } ${
                  selectedAnswer === null ? 'border-transparent' : 'border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedAnswer !== null && (
                    (index === 0 ? question.isTrue : !question.isTrue) ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : selectedAnswer === index ? (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                    ) : null
                  )}
                </div>
              </button>
            ))}
            {selectedAnswer !== null && question.explanation && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                {question.explanation}
              </div>
            )}
          </div>
        );

      case QuizType.Reordering:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {reorderItems.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-move transition-all ${
                    draggedIndex === index
                      ? 'opacity-50 bg-gray-600/50'
                      : 'bg-gray-700/50 hover:bg-gray-600/50'
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="flex items-center">
                    <div className="mr-3 text-gray-400">
                      {index + 1}.
                    </div>
                    {item}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleSortingCheck}
              disabled={isSubmitting || selectedAnswer !== null}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Order
            </button>
            <p className="text-sm text-gray-400 text-center">
              Drag and drop items to arrange them in the correct order
            </p>
          </div>
        );

      case QuizType.AudioBased:
        return (
          <div className="space-y-4">
            <audio
              controls
              src={question.audioUrl}
              className="w-full"
            />
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index === question.correctIndex)}
                  disabled={isSubmitting || selectedAnswer !== null}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    selectedAnswer === null
                      ? 'bg-gray-700/50 hover:bg-gray-700'
                      : selectedAnswer === index
                      ? index === question.correctIndex
                        ? 'bg-green-500/20 border-green-500'
                        : 'bg-red-500/20 border-red-500'
                      : index === question.correctIndex
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-gray-700/50'
                  } ${
                    selectedAnswer === null ? 'border-transparent' : 'border'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case QuizType.Speaking:
        useEffect(() => {
          let recognitionInstance: SpeechRecognition | null = null;

          if (typeof window !== 'undefined') {
            const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognitionAPI) {
              recognitionInstance = new SpeechRecognitionAPI();
              recognitionInstance.continuous = false;
              recognitionInstance.interimResults = false;
              recognitionInstance.lang = 'en-US';

              recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
                const last = event.results.length - 1;
                const transcript = event.results.item(last).item(0).transcript.trim().toLowerCase();
                setTranscript(transcript);
                
                // Compare with target phrase
                const targetWords = question.targetPhrase?.toLowerCase().split(' ') || [];
                const spokenWords = transcript.split(' ');
                const isCorrect = targetWords.length > 0 && 
                  targetWords.length === spokenWords.length &&
                  targetWords.every((word, index) => {
                    const spokenWord = spokenWords[index];
                    return word === spokenWord || 
                      (spokenWord && word.length > 3 && 
                       (word.includes(spokenWord) || spokenWord.includes(word)));
                  });

                handleAnswer(isCorrect);
                setSelectedAnswer(0);
                setIsRecording(false);
                stopAudioAnalysis();
              };

              recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error);
                setError(event.error);
                setIsRecording(false);
                stopAudioAnalysis();
              };

              recognitionInstance.onend = () => {
                setIsRecording(false);
                stopAudioAnalysis();
              };

              setRecognition(recognitionInstance);
            }
          }

          return () => {
            if (recognitionInstance) {
              try {
                recognitionInstance.stop();
              } catch (err) {
                // Ignore errors when stopping
              }
            }
            stopAudioAnalysis();
          };
        }, [question.targetPhrase]);

        const startAudioAnalysis = async () => {
          try {
            mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext.current = new AudioContext();
            analyser.current = audioContext.current.createAnalyser();
            const source = audioContext.current.createMediaStreamSource(mediaStream.current);
            source.connect(analyser.current);
            analyser.current.fftSize = 256;
            const bufferLength = analyser.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateVolume = () => {
              if (analyser.current && isRecording) {
                analyser.current.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / bufferLength;
                setVolume(average);
                requestAnimationFrame(updateVolume);
              }
            };
            updateVolume();
          } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Could not access microphone');
          }
        };

        const stopAudioAnalysis = () => {
          if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
            mediaStream.current = null;
          }
          if (audioContext.current) {
            audioContext.current.close();
            audioContext.current = null;
          }
          analyser.current = null;
          setVolume(0);
        };

        const handleRecord = async () => {
          setError(null);
          if (recognition && !isRecording && !selectedAnswer) {
            try {
              await startAudioAnalysis();
              recognition.start();
              setIsRecording(true);
            } catch (err) {
              console.error('Error starting recording:', err);
              setError('Could not start recording');
            }
          }
        };

        const handleRetry = () => {
          setSelectedAnswer(null);
          setTranscript('');
          setError(null);
        };

        return (
          <div className="space-y-4">
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <p className="text-lg mb-2" role="heading" aria-level={3}>{question.targetPhrase}</p>
              {question.phonetics && (
                <p className="text-sm text-gray-400 font-mono" aria-label="Phonetic pronunciation">{question.phonetics}</p>
              )}
            </div>

            {recognition ? (
              <>
                <div className="relative">
                  <button
                    onClick={handleRecord}
                    disabled={isRecording || selectedAnswer !== null}
                    className={`flex items-center justify-center w-full p-4 rounded-lg transition-colors ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } ${(isRecording || selectedAnswer !== null) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={isRecording ? 'Recording in progress' : 'Start recording'}
                    aria-pressed={isRecording}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    {isRecording ? 'Recording...' : 'Start Recording'}
                  </button>
                  {isRecording && (
                    <div 
                      className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-100"
                      style={{ width: `${(volume / 255) * 100}%` }}
                      role="progressbar"
                      aria-valuenow={Math.round((volume / 255) * 100)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Recording volume level"
                    />
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400" role="alert">
                    {error}
                  </div>
                )}

                {transcript && selectedAnswer !== null && (
                  <div 
                    className={`p-4 rounded-lg ${
                      transcript.toLowerCase() === question.targetPhrase?.toLowerCase()
                        ? 'bg-green-500/20 border-green-500'
                        : 'bg-red-500/20 border-red-500'
                    } border`}
                    role="alert"
                  >
                    <p className="font-medium mb-2">Your pronunciation:</p>
                    <p className="font-mono">{transcript}</p>
                    <button
                      onClick={handleRetry}
                      className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                      aria-label="Try pronunciation again"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-red-400" role="alert">
                Speech recognition is not supported in your browser
              </div>
            )}
          </div>
        );

      case QuizType.ShortAnswer:
        return (
          <div className="space-y-4">
            <textarea
              placeholder="Type your answer..."
              className="w-full h-32 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting || selectedAnswer !== null}
              aria-label="Short answer response"
              aria-disabled={isSubmitting || selectedAnswer !== null}
            />
            <button
              onClick={handleShortAnswerSubmit}
              disabled={isSubmitting || selectedAnswer !== null}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              aria-label="Submit answer"
            >
              Submit Answer
            </button>
            {selectedAnswer !== null && (
              <div className="p-4 bg-gray-700/50 rounded-lg" role="alert">
                <p className="font-medium mb-2">Sample Answer:</p>
                <p>{question.sampleAnswer}</p>
                {question.keywords && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">Key concepts that should be included:</p>
                    <ul className="list-disc list-inside text-sm text-gray-400" role="list">
                      {question.keywords.map((keyword, index) => (
                        <li key={index} role="listitem">{keyword}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case QuizType.Sorting:
        return (
          <div className="space-y-4">
            {/* Unsorted items */}
            {sortedItems['Unsorted'] && sortedItems['Unsorted'].length > 0 && (
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h4 className="font-medium mb-2">Items to Sort</h4>
                <div className="grid grid-cols-1 gap-2">
                  {sortedItems['Unsorted'].map((item, index) => (
                    <div
                      key={`unsorted-${index}`}
                      className="p-2 bg-gray-600/50 rounded cursor-move"
                      draggable
                      onDragStart={(e) => setDraggedItem(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category containers */}
            {Object.entries(question.categories || {}).map(([category], categoryIndex) => (
              <div 
                key={category} 
                className="p-4 bg-gray-700/50 rounded-lg"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedItem && !selectedAnswer) {
                    // Remove from previous category
                    const newSortedItems = { ...sortedItems };
                    Object.keys(newSortedItems).forEach(key => {
                      newSortedItems[key] = newSortedItems[key].filter(item => item !== draggedItem);
                    });
                    
                    // Add to new category
                    if (!newSortedItems[category]) {
                      newSortedItems[category] = [];
                    }
                    newSortedItems[category].push(draggedItem);
                    
                    setSortedItems(newSortedItems);
                    setDraggedItem(null);
                  }
                }}
              >
                <h4 className="font-medium mb-2">{category}</h4>
                <div className="grid grid-cols-1 gap-2 min-h-[50px]">
                  {(sortedItems[category] || []).map((item, itemIndex) => (
                    <div
                      key={`${category}-${itemIndex}`}
                      className="p-2 bg-gray-600/50 rounded cursor-move"
                      draggable
                      onDragStart={(e) => setDraggedItem(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSortingCheck}
              disabled={isSubmitting || selectedAnswer !== null || (sortedItems['Unsorted']?.length || 0) > 0}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Categories
            </button>
            {(sortedItems['Unsorted']?.length || 0) > 0 && (
              <p className="text-sm text-red-400 text-center">
                Sort all items into categories before checking
              </p>
            )}
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Quiz</h2>
      
      {!showResults ? (
        <div className="space-y-6">
          <div className="mb-4">
            <span className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <h3 className="text-lg font-medium mt-2">
              {questions[currentQuestion].question}
            </h3>
          </div>

          {renderQuestion()}

          {selectedAnswer !== null && questions[currentQuestion].hint && (
            <div className="mt-4">
              <button
                onClick={handleGetHint}
                disabled={loadingHint}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <LightBulbIcon className="w-5 h-5" />
                <span>{loadingHint ? 'Getting hint...' : 'Get a hint'}</span>
              </button>
              {hint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm"
                >
                  {hint}
                </motion.div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">
            Quiz Complete!
          </h3>
          <p className="text-gray-400">
            You scored {finalScore}%
          </p>
        </div>
      )}
    </motion.div>
  );
} 