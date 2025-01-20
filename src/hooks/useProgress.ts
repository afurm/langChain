import { useState, useEffect } from 'react';

interface UseProgressProps {
  totalSteps: number;
  onProgressComplete?: () => void;
}

export function useProgress({ totalSteps, onProgressComplete }: UseProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isComplete) {
        setTimeSpent(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete]);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next === totalSteps) {
          setIsComplete(true);
          onProgressComplete?.();
        }
        return next;
      });
    }
  };

  const resetProgress = () => {
    setCurrentStep(0);
    setTimeSpent(0);
    setIsComplete(false);
  };

  return {
    currentStep,
    timeSpent,
    isComplete,
    progress: (currentStep / totalSteps) * 100,
    nextStep,
    resetProgress,
  };
} 