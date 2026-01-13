import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ExerciseTimerProps {
  duration: number; // in seconds
  exerciseName: string;
  onComplete?: () => void;
}

export const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
  duration,
  exerciseName,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const progress = ((duration - timeLeft) / duration) * 100;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const reset = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsComplete(false);
  }, [duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4">
      {/* Timer circle */}
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke={isComplete ? 'hsl(var(--success))' : 'hsl(var(--primary))'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 28}
            strokeDashoffset={2 * Math.PI * 28 - (progress / 100) * 2 * Math.PI * 28}
            className="transition-all duration-1000"
          />
        </svg>
        
        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            'text-sm font-mono font-bold',
            isComplete ? 'text-success' : 'text-foreground'
          )}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          disabled={isComplete}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
            isRunning
              ? 'bg-warning/20 text-warning hover:bg-warning/30'
              : 'bg-primary/20 text-primary hover:bg-primary/30',
            isComplete && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isRunning ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
        
        <button
          onClick={reset}
          className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all duration-200 text-muted-foreground"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Status */}
      {isComplete && (
        <span className="text-xs font-medium text-success animate-fade-in">
          ✓ Complete
        </span>
      )}
    </div>
  );
};
