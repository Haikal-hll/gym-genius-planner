import React from 'react';
import { cn } from '@/lib/utils';
import { UserProfile } from '@/types/expertSystem';
import { User, Target, Dumbbell, Heart, Zap } from 'lucide-react';

interface Step1ProfileProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
}

export const Step1Profile: React.FC<Step1ProfileProps> = ({ profile, onChange }) => {
  const experienceLevels = [
    {
      value: 'beginner',
      label: 'Beginner',
      description: 'New to fitness, learning proper form',
      icon: User,
      color: 'from-green-500 to-emerald-500',
    },
    {
      value: 'intermediate',
      label: 'Intermediate',
      description: 'Consistent training for 6+ months',
      icon: Dumbbell,
      color: 'from-primary to-cyan-400',
    },
  ];

  const trainingGoals = [
    {
      value: 'muscle_gain',
      label: 'Muscle Gain',
      description: 'Build lean muscle mass, hypertrophy focus',
      icon: Dumbbell,
      color: 'from-secondary to-orange-400',
    },
    {
      value: 'strength',
      label: 'Strength',
      description: 'Increase power and lifting capacity',
      icon: Zap,
      color: 'from-primary to-cyan-400',
    },
    {
      value: 'general_fitness',
      label: 'General Fitness',
      description: 'Overall health, endurance, and toning',
      icon: Heart,
      color: 'from-accent to-pink-400',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Experience Level */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Experience Level</h3>
            <p className="text-sm text-muted-foreground">Select your current fitness experience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {experienceLevels.map(({ value, label, description, icon: Icon, color }) => (
            <button
              key={value}
              onClick={() => onChange({ ...profile, experienceLevel: value as any })}
              className={cn(
                'relative p-5 rounded-xl border-2 transition-all duration-300 text-left group',
                profile.experienceLevel === value
                  ? 'border-primary bg-primary/10 glow-primary'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300',
                profile.experienceLevel === value
                  ? `bg-gradient-to-br ${color}`
                  : 'bg-muted group-hover:bg-muted/80'
              )}>
                <Icon className={cn(
                  'w-6 h-6 transition-colors duration-300',
                  profile.experienceLevel === value ? 'text-white' : 'text-muted-foreground'
                )} />
              </div>
              <h4 className="font-semibold text-foreground">{label}</h4>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
              
              {/* Selection indicator */}
              {profile.experienceLevel === value && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Training Goal */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Training Goal</h3>
            <p className="text-sm text-muted-foreground">What do you want to achieve?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trainingGoals.map(({ value, label, description, icon: Icon, color }) => (
            <button
              key={value}
              onClick={() => onChange({ ...profile, trainingGoal: value as any })}
              className={cn(
                'relative p-5 rounded-xl border-2 transition-all duration-300 text-left group',
                profile.trainingGoal === value
                  ? 'border-primary bg-primary/10 glow-primary'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-300',
                profile.trainingGoal === value
                  ? `bg-gradient-to-br ${color}`
                  : 'bg-muted group-hover:bg-muted/80'
              )}>
                <Icon className={cn(
                  'w-5 h-5 transition-colors duration-300',
                  profile.trainingGoal === value ? 'text-white' : 'text-muted-foreground'
                )} />
              </div>
              <h4 className="font-semibold text-foreground text-sm">{label}</h4>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
              
              {profile.trainingGoal === value && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
