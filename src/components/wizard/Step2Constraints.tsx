import React from 'react';
import { cn } from '@/lib/utils';
import { UserConstraints, InjuryType } from '@/types/expertSystem';
import { Calendar, Clock, Flame, AlertTriangle } from 'lucide-react';

interface Step2ConstraintsProps {
  constraints: UserConstraints;
  onChange: (constraints: UserConstraints) => void;
}

export const Step2Constraints: React.FC<Step2ConstraintsProps> = ({
  constraints,
  onChange,
}) => {
  const trainingDaysOptions = [
    { value: 2, label: '2 Days', description: 'Minimal frequency' },
    { value: 3, label: '3 Days', description: 'Balanced approach' },
    { value: 4, label: '4 Days', description: 'Higher frequency' },
  ];

  const timeOptions = [
    { value: 30, label: '30 min', description: 'Quick & efficient' },
    { value: 45, label: '45 min', description: 'Standard duration' },
    { value: 60, label: '60 min', description: 'Full workout' },
  ];

  const intensityOptions = [
    { value: 'light', label: 'Light', description: 'Recovery focus', color: 'from-green-500 to-emerald-500' },
    { value: 'medium', label: 'Medium', description: 'Balanced effort', color: 'from-yellow-500 to-amber-500' },
    { value: 'high', label: 'High', description: 'Maximum intensity', color: 'from-red-500 to-orange-500' },
  ];

  const injuryOptions: { value: InjuryType; label: string; description: string }[] = [
    { value: 'none', label: 'None', description: 'No limitations' },
    { value: 'shoulder', label: 'Shoulder', description: 'Avoid overhead' },
    { value: 'knee', label: 'Knee', description: 'Avoid high impact' },
    { value: 'back', label: 'Back', description: 'Avoid back strain' },
  ];

  const handleInjuryToggle = (injury: InjuryType) => {
    const currentInjuries: InjuryType[] = constraints.injuries || [];
    
    if (injury === 'none') {
      onChange({ ...constraints, injuries: ['none'] as InjuryType[] });
    } else {
      let newInjuries: InjuryType[] = currentInjuries.filter(i => i !== 'none');
      
      if (newInjuries.includes(injury)) {
        newInjuries = newInjuries.filter(i => i !== injury);
        if (newInjuries.length === 0) {
          newInjuries = ['none'] as InjuryType[];
        }
      } else {
        newInjuries.push(injury);
      }
      
      onChange({ ...constraints, injuries: newInjuries });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Training Days */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Training Days per Week</h3>
            <p className="text-xs text-muted-foreground">How many days can you train?</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {trainingDaysOptions.map(({ value, label, description }) => (
            <button
              key={value}
              onClick={() => onChange({ ...constraints, trainingDays: value as 2 | 3 | 4 })}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all duration-300 text-center',
                constraints.trainingDays === value
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              )}
            >
              <div className="text-xl font-bold text-foreground">{label}</div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Available */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
            <Clock className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Time Per Session</h3>
            <p className="text-xs text-muted-foreground">How long can you work out?</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {timeOptions.map(({ value, label, description }) => (
            <button
              key={value}
              onClick={() => onChange({ ...constraints, availableTime: value as 30 | 45 | 60 })}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all duration-300 text-center',
                constraints.availableTime === value
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              )}
            >
              <div className="text-xl font-bold text-foreground">{label}</div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Intensity */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Workout Intensity</h3>
            <p className="text-xs text-muted-foreground">How hard do you want to push?</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {intensityOptions.map(({ value, label, description, color }) => (
            <button
              key={value}
              onClick={() => onChange({ ...constraints, intensity: value as 'light' | 'medium' | 'high' })}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all duration-300 text-center',
                constraints.intensity === value
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              )}
            >
              <div className={cn(
                'w-8 h-8 mx-auto rounded-full mb-2 transition-all duration-300',
                constraints.intensity === value
                  ? `bg-gradient-to-br ${color}`
                  : 'bg-muted'
              )} />
              <div className="text-sm font-semibold text-foreground">{label}</div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Physical Limitations */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Physical Limitations</h3>
            <p className="text-xs text-muted-foreground">Select all that apply (important for safety)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {injuryOptions.map(({ value, label, description }) => {
            const isSelected = constraints.injuries?.includes(value);
            
            return (
              <button
                key={value}
                onClick={() => handleInjuryToggle(value)}
                className={cn(
                  'relative p-4 rounded-xl border-2 transition-all duration-300 text-center',
                  isSelected
                    ? value === 'none'
                      ? 'border-success bg-success/10'
                      : 'border-destructive bg-destructive/10'
                    : 'border-border bg-card hover:border-primary/50'
                )}
              >
                <div className="text-sm font-semibold text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground">{description}</div>
                
                {isSelected && (
                  <div className={cn(
                    'absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center',
                    value === 'none' ? 'bg-success' : 'bg-destructive'
                  )}>
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
