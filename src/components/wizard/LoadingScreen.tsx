import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Brain, CheckCircle2, Cpu, Database, AlertTriangle, Zap } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  const phases = [
    { icon: Database, label: 'Loading Knowledge Base', description: 'Initializing exercise database...' },
    { icon: AlertTriangle, label: 'Checking Constraints', description: 'Validating physical limitations...' },
    { icon: Cpu, label: 'Running Inference Engine', description: 'Applying expert rules...' },
    { icon: Brain, label: 'Optimizing Workout Plan', description: 'Calculating optimal schedule...' },
    { icon: Zap, label: 'Generating Results', description: 'Finalizing your personalized plan...' },
  ];

  useEffect(() => {
    const totalDuration = 3000; // 3 seconds total
    const phaseCount = phases.length;
    const phaseDuration = totalDuration / phaseCount;

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, totalDuration / 100);

    // Phase animation
    const phaseInterval = setInterval(() => {
      setCurrentPhase((prev) => {
        if (prev >= phaseCount - 1) {
          clearInterval(phaseInterval);
          setTimeout(onComplete, 500);
          return prev;
        }
        return prev + 1;
      });
    }, phaseDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-lg w-full mx-4 text-center">
        {/* Central animation */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-spin-slow" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          
          {/* Inner icon */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            {React.createElement(phases[currentPhase].icon, {
              className: 'w-12 h-12 text-primary animate-pulse-slow',
            })}
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Inference Engine Processing
        </h2>
        <p className="text-muted-foreground mb-8">
          Generating your personalized workout plan...
        </p>

        {/* Progress bar */}
        <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-6 mx-8">
          <div
            className="absolute h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-100 rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute h-full w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
            style={{ left: `${progress - 8}%` }}
          />
        </div>

        {/* Phases list */}
        <div className="space-y-3 mx-8">
          {phases.map((phase, index) => {
            const isComplete = index < currentPhase;
            const isCurrent = index === currentPhase;

            return (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
                  isCurrent && 'bg-primary/10 border border-primary/30',
                  isComplete && 'opacity-60'
                )}
              >
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300',
                  isComplete ? 'bg-success' : isCurrent ? 'bg-primary' : 'bg-muted'
                )}>
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-success-foreground" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <div className={cn(
                    'text-sm font-medium',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {phase.label}
                  </div>
                  {isCurrent && (
                    <div className="text-xs text-muted-foreground animate-pulse">
                      {phase.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress percentage */}
        <div className="mt-6 text-2xl font-bold text-primary">
          {progress}%
        </div>
      </div>
    </div>
  );
};
