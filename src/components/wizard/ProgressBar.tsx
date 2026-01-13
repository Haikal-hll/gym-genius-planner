import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: { label: string; description: string }[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  steps,
}) => {
  const progress = ((currentStep) / totalSteps) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      {/* Progress bar track */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-6">
        <div
          className="absolute h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-500 ease-out rounded-full progress-glow"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={index}
              className={cn(
                'flex flex-col items-center transition-all duration-300',
                isActive ? 'scale-110' : ''
              )}
            >
              {/* Circle indicator */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2',
                  isCompleted
                    ? 'bg-primary text-primary-foreground border-primary glow-primary'
                    : isActive
                    ? 'bg-card text-primary border-primary glow-primary'
                    : 'bg-muted text-muted-foreground border-border'
                )}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'mt-2 text-xs font-medium hidden sm:block transition-colors duration-300',
                  isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>

              {/* Description */}
              <span
                className={cn(
                  'text-[10px] text-muted-foreground hidden md:block',
                  isActive ? 'text-muted-foreground' : ''
                )}
              >
                {step.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
