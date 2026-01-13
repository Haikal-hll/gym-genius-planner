import React from 'react';
import { cn } from '@/lib/utils';
import { InferenceLogEntry } from '@/types/expertSystem';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface InferenceLogProps {
  logs: InferenceLogEntry[];
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const InferenceLog: React.FC<InferenceLogProps> = ({
  logs,
  isExpanded = true,
  onToggle,
}) => {
  const getTypeStyles = (type: InferenceLogEntry['type']) => {
    switch (type) {
      case 'system':
        return 'text-cyan-400';
      case 'constraint':
        return 'text-yellow-400';
      case 'rule':
        return 'text-purple-400';
      case 'optimization':
        return 'text-blue-400';
      case 'calculation':
        return 'text-orange-400';
      case 'warning':
        return 'text-amber-400';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-foreground';
    }
  };

  const getTypeLabel = (type: InferenceLogEntry['type']) => {
    switch (type) {
      case 'system':
        return 'SYS';
      case 'constraint':
        return 'CON';
      case 'rule':
        return 'RUL';
      case 'optimization':
        return 'OPT';
      case 'calculation':
        return 'CAL';
      case 'warning':
        return 'WRN';
      case 'success':
        return 'OK';
      default:
        return '   ';
    }
  };

  return (
    <div className="rounded-xl border border-primary/30 overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-gradient-to-r from-primary/20 to-transparent flex items-center justify-between hover:from-primary/30 transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <span className="font-mono font-semibold text-foreground">Inference Engine Log</span>
          <span className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary font-mono">
            {logs.length} entries
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Log content */}
      {isExpanded && (
        <div className="bg-[hsl(220,25%,5%)] p-4 max-h-96 overflow-y-auto font-mono text-sm">
          {logs.map((log, index) => (
            <div
              key={index}
              className={cn(
                'flex gap-3 py-1 animate-slide-in',
                log.message.startsWith('═') && 'my-2'
              )}
              style={{ animationDelay: `${index * 20}ms` }}
            >
              {/* Type badge */}
              {!log.message.startsWith('═') && !log.message.startsWith('─') && (
                <span className={cn(
                  'flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-bold uppercase',
                  getTypeStyles(log.type),
                  'bg-current/10'
                )}>
                  [{getTypeLabel(log.type)}]
                </span>
              )}
              
              {/* Message */}
              <span className={cn(
                getTypeStyles(log.type),
                log.message.startsWith('═') && 'text-primary font-bold',
                log.message.startsWith('─') && 'text-muted-foreground',
                log.message.startsWith('▶') && 'text-primary font-semibold'
              )}>
                {log.message.startsWith('═') || log.message.startsWith('─') || log.message.startsWith('▶')
                  ? log.message
                  : `> ${log.message}`}
              </span>
            </div>
          ))}
          
          {/* Blinking cursor */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-primary">{'>'}</span>
            <span className="w-2 h-4 bg-primary animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};
