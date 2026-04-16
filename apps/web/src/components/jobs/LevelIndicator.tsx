import { HugeiconsIcon } from '@hugeicons/react';
import { UserFullViewIcon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

type LevelName = 'Junior' | 'Confirmed' | 'Senior' | 'Lead' | 'Manager' | 'Consultant' | 'Founding';
type LevelColor = 'yellow' | 'orange' | 'red' | 'violet';

const LEVEL_CONFIG: Record<LevelName, LevelColor> = {
  Junior:     'yellow',
  Confirmed:  'orange',
  Senior:     'red',
  Consultant: 'red',
  Lead:       'violet',
  Manager:    'violet',
  Founding:   'violet',
};

const COLOR_CLASSES: Record<LevelColor, { icon: string; text: string }> = {
  yellow: { icon: 'text-yellow-400', text: 'text-yellow-500' },
  orange: { icon: 'text-orange-400', text: 'text-orange-500' },
  red:    { icon: 'text-red-400',    text: 'text-red-500'    },
  violet: { icon: 'text-violet-500', text: 'text-violet-500' },
};

interface LevelIndicatorProps {
  level: LevelName;
  className?: string;
}

export function LevelIndicator({ level, className }: LevelIndicatorProps) {
  const color = LEVEL_CONFIG[level] ?? 'yellow';
  const classes = COLOR_CLASSES[color];

  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      <HugeiconsIcon icon={UserFullViewIcon} size={24} className={classes.icon} />
      <span className={cn('text-xs font-medium', classes.text)}>{level}</span>
    </div>
  );
}
