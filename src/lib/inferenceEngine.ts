import { exerciseDatabase } from '@/data/exerciseDatabase';
import {
  UserProfile,
  UserConstraints,
  Equipment,
  Exercise,
  ExpertSystemResult,
  InferenceLogEntry,
  WCSCalculation,
  WorkoutDay,
  WorkoutSession,
  ScheduledExercise,
} from '@/types/expertSystem';

// Inference Engine for HomeGym Expert System
export class InferenceEngine {
  private log: InferenceLogEntry[] = [];
  private filteredByEquipment: string[] = [];
  private filteredByInjury: string[] = [];

  private addLog(type: InferenceLogEntry['type'], message: string) {
    this.log.push({
      timestamp: Date.now(),
      type,
      message,
    });
  }

  // Calculate WCS = (Experience + TrainingDays + Intensity) - TimeConstraint
  private calculateWCS(
    profile: UserProfile,
    constraints: UserConstraints
  ): WCSCalculation {
    // Map experience level to value
    const experienceValue = profile.experienceLevel === 'beginner' ? 0 : 1;
    this.addLog('calculation', `Experience Level: ${profile.experienceLevel} → Value: ${experienceValue}`);

    // Map training days to value
    const trainingDaysMap: Record<number, number> = { 2: 0, 3: 1, 4: 2 };
    const trainingDaysValue = trainingDaysMap[constraints.trainingDays || 2];
    this.addLog('calculation', `Training Days: ${constraints.trainingDays} days/week → Value: ${trainingDaysValue}`);

    // Map intensity to value
    const intensityMap: Record<string, number> = { light: 0, medium: 1, high: 2 };
    const intensityValue = intensityMap[constraints.intensity || 'medium'];
    this.addLog('calculation', `Intensity: ${constraints.intensity} → Value: ${intensityValue}`);

    // Map time constraint (inverted: 60min=0, 45min=1, 30min=2)
    const timeConstraintMap: Record<number, number> = { 60: 0, 45: 1, 30: 2 };
    const timeConstraintValue = timeConstraintMap[constraints.availableTime || 60];
    this.addLog('calculation', `Time Available: ${constraints.availableTime} minutes → Time Constraint: ${timeConstraintValue}`);

    // Calculate WCS
    const wcsScore = (experienceValue + trainingDaysValue + intensityValue) - timeConstraintValue;
    this.addLog('calculation', `WCS Formula: (${experienceValue} + ${trainingDaysValue} + ${intensityValue}) - ${timeConstraintValue} = ${wcsScore}`);

    // Determine interpretation
    let interpretation: string;
    if (wcsScore <= 1) {
      interpretation = 'Basic workout complexity - focusing on fundamental movements with adequate rest';
    } else if (wcsScore <= 3) {
      interpretation = 'Moderate workout complexity - balanced approach with progressive exercises';
    } else {
      interpretation = 'Advanced workout complexity - challenging exercises with higher intensity';
    }

    this.addLog('optimization', `WCS Interpretation: ${interpretation}`);

    return {
      experienceValue,
      trainingDaysValue,
      intensityValue,
      timeConstraintValue,
      wcsScore,
      interpretation,
    };
  }

  // Filter exercises based on available equipment
  private filterByEquipment(exercises: Exercise[], equipment: Equipment): Exercise[] {
    const availableEquipment = Object.entries(equipment)
      .filter(([, available]) => available)
      .map(([key]) => key as keyof Equipment);

    this.addLog('system', `Available Equipment: ${availableEquipment.join(', ')}`);

    return exercises.filter((exercise) => {
      const hasAllEquipment = exercise.equipmentNeeded.every((eq) =>
        availableEquipment.includes(eq)
      );

      if (!hasAllEquipment) {
        this.filteredByEquipment.push(exercise.name);
        this.addLog('constraint', `Equipment Rule: Excluding "${exercise.name}" - requires ${exercise.equipmentNeeded.join(', ')}`);
      }

      return hasAllEquipment;
    });
  }

  // Filter exercises based on physical limitations
  private filterByInjuries(exercises: Exercise[], injuries: string[]): Exercise[] {
    return exercises.filter((exercise) => {
      // Knee injury - remove high impact leg exercises
      if (injuries.includes('knee') && exercise.muscleGroup === 'legs' && exercise.impactLevel === 'high') {
        this.filteredByInjury.push(exercise.name);
        this.addLog('constraint', `Injury Rule: Excluding "${exercise.name}" - High impact not suitable for knee injury`);
        return false;
      }

      // Shoulder injury - remove overhead movements
      if (injuries.includes('shoulder') && exercise.isOverhead) {
        this.filteredByInjury.push(exercise.name);
        this.addLog('constraint', `Injury Rule: Excluding "${exercise.name}" - Overhead movement not suitable for shoulder injury`);
        return false;
      }

      // Back injury - remove back-straining exercises
      if (injuries.includes('back') && exercise.isBackStrain) {
        this.filteredByInjury.push(exercise.name);
        this.addLog('constraint', `Injury Rule: Excluding "${exercise.name}" - Movement strains lower back`);
        return false;
      }

      return true;
    });
  }

  // Adjust exercise parameters based on goal
  private adjustForGoal(exercise: Exercise, goal: string, wcs: number): ScheduledExercise {
    let sets = exercise.setsDefault;
    let reps = exercise.repsDefault;
    let rest = exercise.restSeconds;
    let notes = '';

    switch (goal) {
      case 'strength':
        sets = Math.min(sets + 1, 5);
        reps = Math.max(reps - 4, 4);
        rest = Math.min(rest + 30, 120);
        notes = 'Focus on heavy weight, controlled movement';
        break;
      case 'muscle_gain':
        sets = Math.min(sets + 1, 4);
        reps = Math.min(reps + 2, 12);
        rest = 75;
        notes = 'Focus on mind-muscle connection, slow negatives';
        break;
      case 'general_fitness':
        reps = Math.min(reps + 3, 15);
        rest = Math.max(rest - 15, 30);
        notes = 'Keep heart rate elevated, minimal rest';
        break;
    }

    // Adjust based on WCS
    if (wcs >= 4) {
      sets = Math.min(sets + 1, 5);
      rest = Math.max(rest - 15, 30);
    } else if (wcs <= 1) {
      sets = Math.max(sets - 1, 2);
      rest = Math.min(rest + 15, 120);
    }

    return {
      exercise,
      sets,
      reps,
      restSeconds: rest,
      notes,
    };
  }

  // Generate workout plan based on training days
  private generateWorkoutPlan(
    exercises: Exercise[],
    constraints: UserConstraints,
    profile: UserProfile,
    wcs: WCSCalculation
  ): WorkoutDay[] {
    const trainingDays = constraints.trainingDays || 3;
    const availableTime = constraints.availableTime || 45;
    const goal = profile.trainingGoal || 'general_fitness';

    this.addLog('system', `Generating ${trainingDays}-day workout plan with ${availableTime} min sessions`);

    // Determine split type based on training days
    let splitType: string;
    if (trainingDays === 2) {
      splitType = 'Full Body';
      this.addLog('rule', `Split Rule: ${trainingDays} days/week → Full Body Split`);
    } else if (trainingDays === 3) {
      splitType = 'Upper/Lower/Full Body';
      this.addLog('rule', `Split Rule: ${trainingDays} days/week → Upper/Lower/Full Body Split`);
    } else {
      splitType = 'Upper/Lower Split';
      this.addLog('rule', `Split Rule: ${trainingDays} days/week → Upper/Lower Split`);
    }

    // Group exercises by muscle group
    const pushExercises = exercises.filter((e) => e.muscleGroup === 'push');
    const pullExercises = exercises.filter((e) => e.muscleGroup === 'pull');
    const legExercises = exercises.filter((e) => e.muscleGroup === 'legs');
    const coreExercises = exercises.filter((e) => e.muscleGroup === 'core');

    const days: WorkoutDay[] = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Calculate approximate exercises per session based on available time
    const warmupCooldown = 8; // 5min warmup + 3min cooldown
    const avgExerciseDuration = 6; // minutes per exercise including rest
    const exercisesPerSession = Math.floor((availableTime - warmupCooldown) / avgExerciseDuration);
    const sessionsPerDay = 1; // Each session fits within availableTime

    this.addLog('optimization', `Time Per Session: ${availableTime} minutes (including ${warmupCooldown}min warmup/cooldown)`);
    this.addLog('optimization', `Estimated Exercises Per Day: ~${exercisesPerSession} exercises to fit time limit`);

    // Generate days based on split type
    if (trainingDays === 2) {
      // Full Body x2
      for (let i = 0; i < 2; i++) {
        const dayIndex = i === 0 ? 1 : 4; // Tuesday, Friday
        const dayExercises = [
          ...pushExercises.slice(0, 2),
          ...pullExercises.slice(0, 2),
          ...legExercises.slice(0, 2),
          ...coreExercises.slice(0, 1),
        ];
        
        days.push(this.createWorkoutDay(
          dayNames[dayIndex],
          'Full Body',
          dayExercises,
          goal,
          wcs.wcsScore,
          availableTime,
          sessionsPerDay
        ));
      }
    } else if (trainingDays === 3) {
      // Upper / Lower / Full Body
      const patterns = [
        { day: 1, focus: 'Upper Body', exercises: [...pushExercises.slice(0, 3), ...pullExercises.slice(0, 3)] },
        { day: 3, focus: 'Lower Body', exercises: [...legExercises.slice(0, 4), ...coreExercises.slice(0, 2)] },
        { day: 5, focus: 'Full Body', exercises: [...pushExercises.slice(0, 2), ...pullExercises.slice(0, 2), ...legExercises.slice(0, 2)] },
      ];

      for (const pattern of patterns) {
        days.push(this.createWorkoutDay(
          dayNames[pattern.day],
          pattern.focus,
          pattern.exercises,
          goal,
          wcs.wcsScore,
          availableTime,
          sessionsPerDay
        ));
      }
    } else {
      // Upper/Lower Split x2
      const patterns = [
        { day: 0, focus: 'Upper Body (Push)', exercises: [...pushExercises.slice(0, 4), ...coreExercises.slice(0, 1)] },
        { day: 1, focus: 'Lower Body', exercises: [...legExercises.slice(0, 4), ...coreExercises.slice(0, 2)] },
        { day: 3, focus: 'Upper Body (Pull)', exercises: [...pullExercises.slice(0, 4), ...coreExercises.slice(0, 1)] },
        { day: 4, focus: 'Lower Body + Core', exercises: [...legExercises.slice(2, 5), ...coreExercises.slice(1, 4)] },
      ];

      for (const pattern of patterns) {
        days.push(this.createWorkoutDay(
          dayNames[pattern.day],
          pattern.focus,
          pattern.exercises,
          goal,
          wcs.wcsScore,
          availableTime,
          sessionsPerDay
        ));
      }
    }

    // Log goal-specific optimization
    if (goal === 'strength') {
      this.addLog('optimization', `Goal Optimization: Strength → Increasing rest periods, reducing reps`);
    } else if (goal === 'muscle_gain') {
      this.addLog('optimization', `Goal Optimization: Muscle Gain → Focus on time under tension`);
    } else {
      this.addLog('optimization', `Goal Optimization: General Fitness → Circuit-style with minimal rest`);
    }

    return days;
  }

  private createWorkoutDay(
    dayName: string,
    focus: string,
    exercises: Exercise[],
    goal: string,
    wcs: number,
    availableTime: number,
    sessionsPerDay: number
  ): WorkoutDay {
    const sessions: WorkoutSession[] = [];
    const timePerSession = availableTime; // Each day should fit within availableTime
    
    let totalCalories = 0;
    let totalDuration = 0;

    // Calculate how much time each exercise takes (including rest between sets)
    const getExerciseTotalTime = (scheduled: ScheduledExercise): number => {
      const exerciseTime = scheduled.exercise.durationMinutes;
      const restTime = (scheduled.sets - 1) * (scheduled.restSeconds / 60); // Rest between sets in minutes
      return exerciseTime + restTime;
    };

    // Select exercises that fit within the time limit
    const selectedExercises: ScheduledExercise[] = [];
    let currentTime = 0;
    const warmupTime = 5; // 5 minutes for warmup
    const cooldownTime = 3; // 3 minutes for cooldown
    const effectiveTime = timePerSession - warmupTime - cooldownTime;

    for (const ex of exercises) {
      const adjusted = this.adjustForGoal(ex, goal, wcs);
      const exerciseTime = getExerciseTotalTime(adjusted);
      
      if (currentTime + exerciseTime <= effectiveTime) {
        selectedExercises.push(adjusted);
        currentTime += exerciseTime;
        totalCalories += adjusted.exercise.caloriesPerSet * adjusted.sets;
      }
    }

    // If we have very few exercises, adjust sets to fill time
    if (selectedExercises.length < 3 && currentTime < effectiveTime * 0.7) {
      for (const scheduled of selectedExercises) {
        const additionalSets = Math.floor((effectiveTime - currentTime) / selectedExercises.length / 3);
        if (additionalSets > 0) {
          scheduled.sets = Math.min(scheduled.sets + additionalSets, 6);
          totalCalories += scheduled.exercise.caloriesPerSet * additionalSets;
        }
      }
    }

    totalDuration = warmupTime + currentTime + cooldownTime;

    sessions.push({
      sessionNumber: 1,
      exercises: selectedExercises,
      duration: Math.round(totalDuration),
    });

    return {
      dayName,
      focus,
      sessions,
      totalDuration: Math.round(totalDuration),
      totalCalories,
    };
  }

  // Calculate volume score
  private calculateVolumeScore(workoutPlan: WorkoutDay[]): number {
    let totalSets = 0;
    let totalReps = 0;

    for (const day of workoutPlan) {
      for (const session of day.sessions) {
        for (const scheduled of session.exercises) {
          totalSets += scheduled.sets;
          totalReps += scheduled.sets * scheduled.reps;
        }
      }
    }

    // Volume Score = (Total Sets × 10) + (Total Reps × 0.5)
    const volumeScore = Math.round(totalSets * 10 + totalReps * 0.5);
    this.addLog('calculation', `Volume Score: (${totalSets} sets × 10) + (${totalReps} reps × 0.5) = ${volumeScore}`);
    
    return volumeScore;
  }

  // Calculate estimated calorie burn
  private calculateCalorieBurn(workoutPlan: WorkoutDay[], intensity: string): number {
    let baseCalories = 0;

    for (const day of workoutPlan) {
      baseCalories += day.totalCalories;
    }

    // Apply intensity multiplier
    const multiplier = intensity === 'high' ? 1.3 : intensity === 'medium' ? 1.1 : 1.0;
    const totalCalories = Math.round(baseCalories * multiplier);

    this.addLog('calculation', `Calorie Burn: ${baseCalories} base × ${multiplier} (${intensity} intensity) = ${totalCalories} kcal/week`);

    return totalCalories;
  }

  // Main execution method
  public run(
    profile: UserProfile,
    constraints: UserConstraints,
    equipment: Equipment
  ): ExpertSystemResult {
    // Reset state
    this.log = [];
    this.filteredByEquipment = [];
    this.filteredByInjury = [];

    this.addLog('system', '═══════════════════════════════════════════════════════');
    this.addLog('system', '    HomeGym Expert System v1.0 - Inference Engine');
    this.addLog('system', '═══════════════════════════════════════════════════════');
    this.addLog('system', 'Initializing Knowledge Base...');
    this.addLog('system', `Loaded ${exerciseDatabase.length} exercises from database`);
    this.addLog('system', '');
    this.addLog('system', '▶ PHASE 1: Input Processing');
    this.addLog('system', '───────────────────────────────────────────────────────');

    // Calculate WCS
    const wcs = this.calculateWCS(profile, constraints);
    
    this.addLog('system', '');
    this.addLog('system', '▶ PHASE 2: Constraint Checking');
    this.addLog('system', '───────────────────────────────────────────────────────');

    // Filter exercises
    let availableExercises = this.filterByEquipment([...exerciseDatabase], equipment);
    this.addLog('system', `Exercises after equipment filter: ${availableExercises.length}`);

    const injuries = constraints.injuries.filter((i) => i !== 'none');
    if (injuries.length > 0) {
      this.addLog('warning', `Physical Limitations Detected: ${injuries.join(', ')}`);
      availableExercises = this.filterByInjuries(availableExercises, injuries);
      this.addLog('system', `Exercises after injury filter: ${availableExercises.length}`);
    } else {
      this.addLog('success', 'No physical limitations detected');
    }

    this.addLog('system', '');
    this.addLog('system', '▶ PHASE 3: Workout Plan Generation');
    this.addLog('system', '───────────────────────────────────────────────────────');

    // Generate workout plan
    const workoutPlan = this.generateWorkoutPlan(
      availableExercises,
      constraints,
      profile,
      wcs
    );

    this.addLog('system', '');
    this.addLog('system', '▶ PHASE 4: Performance Metrics Calculation');
    this.addLog('system', '───────────────────────────────────────────────────────');

    // Calculate metrics
    const volumeScore = this.calculateVolumeScore(workoutPlan);
    const estimatedCalorieBurn = this.calculateCalorieBurn(
      workoutPlan,
      constraints.intensity || 'medium'
    );

    this.addLog('system', '');
    this.addLog('success', '═══════════════════════════════════════════════════════');
    this.addLog('success', '    Inference Complete - Workout Plan Generated!');
    this.addLog('success', `    WCS: ${wcs.wcsScore} | Volume: ${volumeScore} | Calories: ${estimatedCalorieBurn} kcal`);
    this.addLog('success', '═══════════════════════════════════════════════════════');

    return {
      wcs,
      volumeScore,
      estimatedCalorieBurn,
      workoutPlan,
      inferenceLog: this.log,
      exercisesFiltered: {
        byEquipment: this.filteredByEquipment,
        byInjury: this.filteredByInjury,
      },
    };
  }
}
