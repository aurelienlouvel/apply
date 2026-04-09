'use client';

import { useState, useTransition } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function LocationField({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: value }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => { setValue(e.target.value); setSaved(false); }}
        placeholder="Paris, France"
        className="border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-300"
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
      />
      <Button
        onClick={handleSave}
        disabled={isPending}
        variant="outline"
        size="default"
        className="shrink-0 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : saved ? (
          <>
            <Check className="h-4 w-4 text-green-500" />
            <span className="ml-1 text-green-600">Sauvegardé</span>
          </>
        ) : (
          'Sauvegarder'
        )}
      </Button>
    </div>
  );
}
