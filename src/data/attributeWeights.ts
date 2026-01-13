import { AttributeWeight } from '@/types/expertSystem';

export const attributeWeights: AttributeWeight[] = [
  // Experience Level Weights
  {
    name: 'Experience Level',
    attribute: 'Beginner',
    value: 0,
    description: 'New to fitness training, requires simpler exercises with lower volume',
  },
  {
    name: 'Experience Level',
    attribute: 'Intermediate',
    value: 1,
    description: 'Has training experience, can handle more complex exercises and higher volume',
  },

  // Training Days Weights
  {
    name: 'Training Days',
    attribute: '2 days/week',
    value: 0,
    description: 'Minimal training frequency, requires Full Body approach',
  },
  {
    name: 'Training Days',
    attribute: '3 days/week',
    value: 1,
    description: 'Moderate frequency, allows Upper/Lower/Full Body split',
  },
  {
    name: 'Training Days',
    attribute: '4 days/week',
    value: 2,
    description: 'Higher frequency, enables Upper/Lower Split routine',
  },

  // Intensity Weights
  {
    name: 'Workout Intensity',
    attribute: 'Light',
    value: 0,
    description: 'Lower effort exercises, longer rest periods, suitable for recovery',
  },
  {
    name: 'Workout Intensity',
    attribute: 'Medium',
    value: 1,
    description: 'Moderate effort, balanced approach between intensity and recovery',
  },
  {
    name: 'Workout Intensity',
    attribute: 'High',
    value: 2,
    description: 'Maximum effort exercises, shorter rest periods, higher calorie burn',
  },

  // Time Constraint Weights (inverted - more time = lower constraint)
  {
    name: 'Time Constraint',
    attribute: '60 minutes',
    value: 0,
    description: 'Maximum time available, no constraint on workout duration',
  },
  {
    name: 'Time Constraint',
    attribute: '45 minutes',
    value: 1,
    description: 'Moderate time constraint, requires efficient exercise selection',
  },
  {
    name: 'Time Constraint',
    attribute: '30 minutes',
    value: 2,
    description: 'Significant time constraint, requires compact high-efficiency workouts',
  },

  // Training Goal Weights
  {
    name: 'Training Goal',
    attribute: 'Muscle Gain',
    value: 0,
    description: 'Focus on hypertrophy, moderate weights, 8-12 rep range, 60-90s rest',
  },
  {
    name: 'Training Goal',
    attribute: 'Strength',
    value: 1,
    description: 'Focus on power, heavier weights, 4-6 rep range, 90-120s rest',
  },
  {
    name: 'Training Goal',
    attribute: 'General Fitness',
    value: 2,
    description: 'Balanced approach, circuit-style, 12-15 rep range, 30-45s rest',
  },

  // Equipment Availability
  {
    name: 'Equipment',
    attribute: 'Dumbbells',
    value: 1,
    description: 'Enables weighted compound and isolation movements',
  },
  {
    name: 'Equipment',
    attribute: 'Resistance Bands',
    value: 1,
    description: 'Provides variable resistance for various exercises',
  },
  {
    name: 'Equipment',
    attribute: 'Bench',
    value: 1,
    description: 'Enables pressing and step movements',
  },
  {
    name: 'Equipment',
    attribute: 'Pull-up Bar',
    value: 1,
    description: 'Enables vertical pulling movements',
  },
  {
    name: 'Equipment',
    attribute: 'Bodyweight',
    value: 1,
    description: 'Always available, enables fundamental movements',
  },

  // Physical Limitations
  {
    name: 'Physical Limitation',
    attribute: 'None',
    value: 0,
    description: 'No restrictions, all exercises available',
  },
  {
    name: 'Physical Limitation',
    attribute: 'Shoulder Injury',
    value: 1,
    description: 'Avoid overhead movements, substitute with floor/horizontal presses',
  },
  {
    name: 'Physical Limitation',
    attribute: 'Knee Injury',
    value: 2,
    description: 'Avoid high-impact leg movements like jumps and lunges',
  },
  {
    name: 'Physical Limitation',
    attribute: 'Back Injury',
    value: 3,
    description: 'Avoid exercises that strain the lower back',
  },
];

export const wcsFormula = {
  formula: 'WCS = (Experience + TrainingDays + Intensity) - TimeConstraint',
  explanation: 'The Workout Complexity Score (WCS) determines the appropriate difficulty and structure of your workout plan.',
  components: [
    {
      name: 'Experience',
      range: '0-1',
      description: 'Your training experience level affects exercise complexity',
    },
    {
      name: 'TrainingDays',
      range: '0-2',
      description: 'Number of training days affects workout split type',
    },
    {
      name: 'Intensity',
      range: '0-2',
      description: 'Desired workout intensity affects volume and rest periods',
    },
    {
      name: 'TimeConstraint',
      range: '0-2',
      description: 'Available time (inverted: more time = lower constraint)',
    },
  ],
  interpretation: [
    { range: 'WCS ≤ 1', level: 'Basic', description: 'Simple exercises, longer rest, fewer sets' },
    { range: 'WCS 2-3', level: 'Moderate', description: 'Balanced workout with moderate complexity' },
    { range: 'WCS ≥ 4', level: 'Advanced', description: 'Complex exercises, shorter rest, higher volume' },
  ],
};
