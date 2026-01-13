import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  canProceed: boolean;
  isLoading?: boolean;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onSubmit,
  canProceed,
  isLoading = false,
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
      {/* Back button */}
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep || isLoading}
        className={cn(
          'flex items-center gap-2 px-6 py-3 transition-all duration-300',
          isFirstStep && 'opacity-0 pointer-events-none'
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Step indicator */}
      <span className="text-sm text-muted-foreground">
        Step {currentStep + 1} of {totalSteps}
      </span>

      {/* Next/Submit button */}
      {isLastStep ? (
        <Button
          onClick={onSubmit}
          disabled={!canProceed || isLoading}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-cyan-400 hover:from-primary/90 hover:to-cyan-400/90 text-primary-foreground font-semibold glow-primary transition-all duration-300"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Generate Plan
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
