import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { WCSCalculation, UserProfile, UserConstraints, Equipment, ExpertSystemResult } from '@/types/expertSystem';
import { attributeWeights, wcsFormula } from '@/data/attributeWeights';
import { Calculator, ChevronDown, ChevronUp, BookOpen, Scale, Info } from 'lucide-react';

interface CalculationBreakdownProps {
  result: ExpertSystemResult;
  profile: UserProfile;
  constraints: UserConstraints;
  equipment: Equipment;
}

export const CalculationBreakdown: React.FC<CalculationBreakdownProps> = ({
  result,
  profile,
  constraints,
  equipment,
}) => {
  const [showWeights, setShowWeights] = useState(false);
  const [showWCSDetails, setShowWCSDetails] = useState(true);
  const [showVolumeDetails, setShowVolumeDetails] = useState(false);

  const { wcs, volumeScore, estimatedCalorieBurn, workoutPlan, exercisesFiltered } = result;

  // Calculate total exercises info
  let totalSets = 0;
  let totalReps = 0;
  let totalExercises = 0;

  workoutPlan.forEach((day) => {
    day.sessions.forEach((session) => {
      session.exercises.forEach((scheduled) => {
        totalExercises++;
        totalSets += scheduled.sets;
        totalReps += scheduled.sets * scheduled.reps;
      });
    });
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Calculation Breakdown</h3>
          <p className="text-sm text-muted-foreground">
            Understand how your results were calculated
          </p>
        </div>
      </div>

      {/* Attribute Weights Toggle */}
      <div className="rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setShowWeights(!showWeights)}
          className="w-full p-4 flex items-center justify-between bg-card hover:bg-muted/50 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-accent" />
            <span className="font-semibold text-foreground">Attribute Weights Reference</span>
            <span className="px-2 py-0.5 rounded text-xs bg-accent/20 text-accent">
              View mappings
            </span>
          </div>
          {showWeights ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {showWeights && (
          <div className="p-4 bg-muted/30 border-t border-border animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Experience Level', 'Training Days', 'Workout Intensity', 'Time Constraint', 'Training Goal', 'Physical Limitation'].map((category) => (
                <div key={category} className="p-3 rounded-lg bg-card border border-border">
                  <h5 className="font-semibold text-foreground text-sm mb-2">{category}</h5>
                  <div className="space-y-1">
                    {attributeWeights
                      .filter((w) => w.name === category)
                      .map((weight, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">{weight.attribute}</span>
                          <span className="font-mono font-bold text-primary">{weight.value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WCS Calculation */}
      <div className="rounded-xl border border-primary/30 overflow-hidden">
        <button
          onClick={() => setShowWCSDetails(!showWCSDetails)}
          className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent hover:from-primary/20 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">WCS (Workout Complexity Score) Calculation</span>
          </div>
          {showWCSDetails ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {showWCSDetails && (
          <div className="p-4 bg-muted/30 border-t border-border animate-fade-in">
            {/* Formula */}
            <div className="p-4 rounded-lg bg-card border border-primary/20 mb-4">
              <div className="font-mono text-lg text-center text-primary font-bold">
                {wcsFormula.formula}
              </div>
              <p className="text-sm text-center text-muted-foreground mt-2">
                {wcsFormula.explanation}
              </p>
            </div>

            {/* Your Values */}
            <h5 className="font-semibold text-foreground mb-3">Your Calculation:</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-card border border-border text-center">
                <div className="text-xs text-muted-foreground mb-1">Experience</div>
                <div className="text-2xl font-bold text-primary">{wcs.experienceValue}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  ({profile.experienceLevel})
                </div>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border text-center">
                <div className="text-xs text-muted-foreground mb-1">Training Days</div>
                <div className="text-2xl font-bold text-primary">{wcs.trainingDaysValue}</div>
                <div className="text-xs text-muted-foreground">
                  ({constraints.trainingDays} days/wk)
                </div>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border text-center">
                <div className="text-xs text-muted-foreground mb-1">Intensity</div>
                <div className="text-2xl font-bold text-primary">{wcs.intensityValue}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  ({constraints.intensity})
                </div>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border text-center">
                <div className="text-xs text-muted-foreground mb-1">Time Constraint</div>
                <div className="text-2xl font-bold text-destructive">-{wcs.timeConstraintValue}</div>
                <div className="text-xs text-muted-foreground">
                  ({constraints.availableTime} min)
                </div>
              </div>
            </div>

            {/* Final Calculation */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/20 to-cyan-500/20 border border-primary/30">
              <div className="font-mono text-center">
                <span className="text-lg">WCS = ({wcs.experienceValue} + {wcs.trainingDaysValue} + {wcs.intensityValue}) - {wcs.timeConstraintValue}</span>
                <span className="text-2xl font-bold text-primary mx-4">=</span>
                <span className="text-3xl font-bold text-primary">{wcs.wcsScore}</span>
              </div>
              <p className="text-sm text-center text-muted-foreground mt-3">
                {wcs.interpretation}
              </p>
            </div>

            {/* WCS Interpretation Guide */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {wcsFormula.interpretation.map((interp) => (
                <div
                  key={interp.range}
                  className={cn(
                    'p-2 rounded-lg text-center text-xs',
                    wcs.wcsScore <= 1 && interp.level === 'Basic'
                      ? 'bg-success/20 border-2 border-success'
                      : wcs.wcsScore >= 2 && wcs.wcsScore <= 3 && interp.level === 'Moderate'
                      ? 'bg-warning/20 border-2 border-warning'
                      : wcs.wcsScore >= 4 && interp.level === 'Advanced'
                      ? 'bg-destructive/20 border-2 border-destructive'
                      : 'bg-muted border border-border'
                  )}
                >
                  <div className="font-semibold">{interp.range}</div>
                  <div className="font-bold mt-1">{interp.level}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Volume Score Calculation */}
      <div className="rounded-xl border border-secondary/30 overflow-hidden">
        <button
          onClick={() => setShowVolumeDetails(!showVolumeDetails)}
          className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-secondary/10 to-transparent hover:from-secondary/20 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-secondary" />
            <span className="font-semibold text-foreground">Volume & Calorie Calculations</span>
          </div>
          {showVolumeDetails ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {showVolumeDetails && (
          <div className="p-4 bg-muted/30 border-t border-border animate-fade-in">
            {/* Volume Score */}
            <div className="p-4 rounded-lg bg-card border border-secondary/20 mb-4">
              <div className="font-mono text-center text-secondary font-bold mb-2">
                Volume Score = (Total Sets × 10) + (Total Reps × 0.5)
              </div>
              <div className="font-mono text-center text-lg">
                = ({totalSets} × 10) + ({totalReps} × 0.5) = <span className="text-2xl font-bold text-secondary">{volumeScore}</span>
              </div>
            </div>

            {/* Calorie Calculation */}
            <div className="p-4 rounded-lg bg-card border border-warning/20">
              <div className="font-mono text-center text-warning font-bold mb-2">
                Calorie Burn = Base Calories × Intensity Multiplier
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Exercises</div>
                  <div className="text-xl font-bold text-foreground">{totalExercises}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Total Sets</div>
                  <div className="text-xl font-bold text-foreground">{totalSets}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Est. Calories/Week</div>
                  <div className="text-xl font-bold text-warning">{estimatedCalorieBurn} kcal</div>
                </div>
              </div>
            </div>

            {/* Filtered Exercises Summary */}
            {(exercisesFiltered.byEquipment.length > 0 || exercisesFiltered.byInjury.length > 0) && (
              <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-sm text-foreground">Filtered Exercises</span>
                </div>
                {exercisesFiltered.byEquipment.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-muted-foreground">By Equipment ({exercisesFiltered.byEquipment.length}): </span>
                    <span className="text-xs text-foreground">{exercisesFiltered.byEquipment.join(', ')}</span>
                  </div>
                )}
                {exercisesFiltered.byInjury.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground">By Injury ({exercisesFiltered.byInjury.length}): </span>
                    <span className="text-xs text-destructive">{exercisesFiltered.byInjury.join(', ')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
