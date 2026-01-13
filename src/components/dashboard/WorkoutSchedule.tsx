import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { WorkoutDay, ScheduledExercise } from '@/types/expertSystem';
import { ExerciseTimer } from './ExerciseTimer';
import { Clock, Flame, ChevronDown, ChevronUp, Dumbbell, RotateCcw } from 'lucide-react';

interface WorkoutScheduleProps {
  workoutPlan: WorkoutDay[];
}

export const WorkoutSchedule: React.FC<WorkoutScheduleProps> = ({ workoutPlan }) => {
  const [expandedDay, setExpandedDay] = useState<string | null>(workoutPlan[0]?.dayName || null);
  const [expandedSession, setExpandedSession] = useState<number | null>(1);

  const toggleDay = (dayName: string) => {
    setExpandedDay(expandedDay === dayName ? null : dayName);
    setExpandedSession(1);
  };

  const getMuscleGroupColor = (group: string) => {
    switch (group) {
      case 'push':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pull':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'legs':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'core':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Dumbbell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Training Schedule</h3>
          <p className="text-sm text-muted-foreground">
            {workoutPlan.length}-day workout plan • Click to expand
          </p>
        </div>
      </div>

      {workoutPlan.map((day) => (
        <div
          key={day.dayName}
          className="rounded-xl border border-border overflow-hidden bg-card transition-all duration-300"
        >
          {/* Day header */}
          <button
            onClick={() => toggleDay(day.dayName)}
            className={cn(
              'w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-all duration-200',
              expandedDay === day.dayName && 'bg-primary/5 border-b border-border'
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-primary-foreground font-bold">
                {day.dayName.slice(0, 3).toUpperCase()}
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-foreground">{day.dayName}</h4>
                <p className="text-sm text-muted-foreground">{day.focus}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Stats */}
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{day.totalDuration} min</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Flame className="w-4 h-4 text-secondary" />
                  <span>{day.totalCalories} kcal</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <RotateCcw className="w-4 h-4" />
                  <span>{day.sessions.length} session{day.sessions.length > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Expand icon */}
              {expandedDay === day.dayName ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </button>

          {/* Expanded content */}
          {expandedDay === day.dayName && (
            <div className="p-4 animate-fade-in">
              {/* Session tabs for multi-session days */}
              {day.sessions.length > 1 && (
                <div className="flex gap-2 mb-4">
                  {day.sessions.map((session) => (
                    <button
                      key={session.sessionNumber}
                      onClick={() => setExpandedSession(session.sessionNumber)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        expandedSession === session.sessionNumber
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      )}
                    >
                      Session {session.sessionNumber}
                      <span className="ml-2 text-xs opacity-70">
                        ({session.duration} min)
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Exercises */}
              {day.sessions
                .filter((s) => day.sessions.length === 1 || s.sessionNumber === expandedSession)
                .map((session) => (
                  <div key={session.sessionNumber} className="space-y-3">
                    {session.exercises.map((scheduled, index) => (
                      <ExerciseCard
                        key={scheduled.exercise.id}
                        scheduled={scheduled}
                        index={index}
                        getMuscleGroupColor={getMuscleGroupColor}
                      />
                    ))}
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

interface ExerciseCardProps {
  scheduled: ScheduledExercise;
  index: number;
  getMuscleGroupColor: (group: string) => string;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  scheduled,
  index,
  getMuscleGroupColor,
}) => {
  const [showTimer, setShowTimer] = useState(false);

  return (
    <div
      className="p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-all duration-200"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Exercise info */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {index + 1}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h5 className="font-semibold text-foreground">
                {scheduled.exercise.name}
              </h5>
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium border',
                getMuscleGroupColor(scheduled.exercise.muscleGroup)
              )}>
                {scheduled.exercise.muscleGroup}
              </span>
            </div>
            
            {scheduled.notes && (
              <p className="text-sm text-muted-foreground mt-1 italic">
                💡 {scheduled.notes}
              </p>
            )}
          </div>
        </div>

        {/* Sets/Reps/Rest */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{scheduled.sets}</div>
            <div className="text-xs text-muted-foreground">Sets</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{scheduled.reps}</div>
            <div className="text-xs text-muted-foreground">Reps</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-secondary">{scheduled.restSeconds}s</div>
            <div className="text-xs text-muted-foreground">Rest</div>
          </div>
          
          {/* Timer toggle */}
          <button
            onClick={() => setShowTimer(!showTimer)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
              showTimer
                ? 'bg-primary text-primary-foreground'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            )}
          >
            {showTimer ? 'Hide Timer' : 'Rest Timer'}
          </button>
        </div>
      </div>

      {/* Timer */}
      {showTimer && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
          <ExerciseTimer
            duration={scheduled.restSeconds}
            exerciseName={scheduled.exercise.name}
          />
        </div>
      )}
    </div>
  );
};
