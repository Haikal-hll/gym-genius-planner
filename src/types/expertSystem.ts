// Type definitions for HomeGym Expert System

export type InjuryType = 'none' | 'shoulder' | 'knee' | 'back';

export interface UserProfile {
  experienceLevel: 'beginner' | 'intermediate' | null;
  trainingGoal: 'muscle_gain' | 'strength' | 'general_fitness' | null;
}

export interface UserConstraints {
  trainingDays: 2 | 3 | 4 | null;
  availableTime: 30 | 45 | 60 | null;
  intensity: 'light' | 'medium' | 'high' | null;
  injuries: InjuryType[];
}

export interface Equipment {
  dumbbells: boolean;
  bands: boolean;
  bench: boolean;
  pullupBar: boolean;
  bodyweight: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: 'push' | 'pull' | 'legs' | 'core';
  equipmentNeeded: (keyof Equipment)[];
  impactLevel: 'high' | 'low';
  isOverhead: boolean;
  isBackStrain: boolean;
  setsDefault: number;
  repsDefault: number;
  restSeconds: number;
  caloriesPerSet: number;
  durationMinutes: number;
}

export interface WorkoutDay {
  dayName: string;
  focus: string;
  sessions: WorkoutSession[];
  totalDuration: number;
  totalCalories: number;
}

export interface WorkoutSession {
  sessionNumber: number;
  exercises: ScheduledExercise[];
  duration: number;
}

export interface ScheduledExercise {
  exercise: Exercise;
  sets: number;
  reps: number;
  restSeconds: number;
  notes?: string;
}

export interface InferenceLogEntry {
  timestamp: number;
  type: 'system' | 'constraint' | 'rule' | 'optimization' | 'calculation' | 'warning' | 'success';
  message: string;
}

export interface WCSCalculation {
  experienceValue: number;
  trainingDaysValue: number;
  intensityValue: number;
  timeConstraintValue: number;
  wcsScore: number;
  interpretation: string;
}

export interface ExpertSystemResult {
  wcs: WCSCalculation;
  volumeScore: number;
  estimatedCalorieBurn: number;
  workoutPlan: WorkoutDay[];
  inferenceLog: InferenceLogEntry[];
  exercisesFiltered: {
    byEquipment: string[];
    byInjury: string[];
  };
}

export interface AttributeWeight {
  name: string;
  attribute: string;
  value: number;
  description: string;
  formula?: string;
}
