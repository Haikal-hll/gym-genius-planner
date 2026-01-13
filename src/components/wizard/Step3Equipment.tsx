import React from 'react';
import { cn } from '@/lib/utils';
import { Equipment } from '@/types/expertSystem';
import { Package } from 'lucide-react';

interface Step3EquipmentProps {
  equipment: Equipment;
  onChange: (equipment: Equipment) => void;
}

export const Step3Equipment: React.FC<Step3EquipmentProps> = ({
  equipment,
  onChange,
}) => {
  const equipmentOptions = [
    {
      key: 'dumbbells',
      label: 'Dumbbells',
      description: 'Adjustable or fixed weight dumbbells',
      icon: '🏋️',
    },
    {
      key: 'bands',
      label: 'Resistance Bands',
      description: 'Loop or handled resistance bands',
      icon: '🔗',
    },
    {
      key: 'bench',
      label: 'Workout Bench',
      description: 'Flat or adjustable bench',
      icon: '🪑',
    },
    {
      key: 'pullupBar',
      label: 'Pull-up Bar',
      description: 'Doorway or wall-mounted bar',
      icon: '🚪',
    },
    {
      key: 'bodyweight',
      label: 'Bodyweight Only',
      description: 'No equipment needed',
      icon: '🧍',
    },
  ];

  const toggleEquipment = (key: keyof Equipment) => {
    onChange({
      ...equipment,
      [key]: !equipment[key],
    });
  };

  const selectedCount = Object.values(equipment).filter(Boolean).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Available Equipment</h3>
            <p className="text-sm text-muted-foreground">Select all equipment you have access to</p>
          </div>
        </div>
        
        <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
          {selectedCount} selected
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipmentOptions.map(({ key, label, description, icon }) => {
          const isSelected = equipment[key as keyof Equipment];

          return (
            <button
              key={key}
              onClick={() => toggleEquipment(key as keyof Equipment)}
              className={cn(
                'relative p-5 rounded-xl border-2 transition-all duration-300 text-left group',
                isSelected
                  ? 'border-primary bg-primary/10 glow-primary'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
              )}
            >
              {/* Icon */}
              <div className="text-4xl mb-3">{icon}</div>

              {/* Content */}
              <h4 className="font-semibold text-foreground">{label}</h4>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>

              {/* Checkbox indicator */}
              <div
                className={cn(
                  'absolute top-4 right-4 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300',
                  isSelected
                    ? 'bg-primary border-primary'
                    : 'border-border group-hover:border-primary/50'
                )}
              >
                {isSelected && (
                  <svg
                    className="w-4 h-4 text-primary-foreground"
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
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info message */}
      {selectedCount === 0 && (
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="font-medium text-warning">No Equipment Selected</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Please select at least "Bodyweight Only" to generate a workout plan.
            </p>
          </div>
        </div>
      )}

      {/* Tip */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div>
          <h4 className="font-medium text-foreground">Pro Tip</h4>
          <p className="text-sm text-muted-foreground mt-1">
            The more equipment you have, the more exercise variety in your plan. 
            Bodyweight exercises are always included as a foundation.
          </p>
        </div>
      </div>
    </div>
  );
};
