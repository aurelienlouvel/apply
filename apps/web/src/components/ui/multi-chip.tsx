'use client';

import { cn } from '@/lib/utils';

interface MultiChipProps {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (next: string[]) => void;
  className?: string;
}

export function MultiChip({ options, value, onChange, className }: MultiChipProps) {
  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => {
        const active = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
              active
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
