'use client';

import { useState, useTransition, useEffect } from 'react';
import { Check, Loader2, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/providers/Providers';
import type { AppSettings } from '@/lib/settings';

interface LinkedInProfile {
  firstName: string;
  lastName: string;
  jobTitle: string;
  location: string;
  avatarUrl: string;
  fetchedAt: string;
}

interface TabProfileProps {
  settings: AppSettings;
}

export function TabProfile({ settings }: TabProfileProps) {
  const { t } = useLocale();
  const tp = t.profile;

  const [form, setForm] = useState({
    firstName: settings.firstName,
    lastName: settings.lastName,
    jobTitle: settings.jobTitle,
    location: settings.location,
    availability: settings.availability,
  });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');

  // Load cached LinkedIn avatar on mount
  useEffect(() => {
    fetch('/api/linkedin/profile')
      .then((r) => r.json())
      .then((data: { ok: boolean; profile: LinkedInProfile | null }) => {
        if (data.ok && data.profile?.avatarUrl) setAvatarUrl(data.profile.avatarUrl);
      })
      .catch(() => {});
  }, []);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  async function handleLinkedInSync() {
    setIsSyncing(true);
    setSyncError('');
    try {
      const res = await fetch('/api/linkedin/profile', { method: 'POST' });
      const data: { ok: boolean; profile?: LinkedInProfile; error?: string } = await res.json();
      if (data.ok && data.profile) {
        const p = data.profile;
        setForm((f) => ({
          ...f,
          firstName: p.firstName || f.firstName,
          lastName: p.lastName || f.lastName,
          jobTitle: p.jobTitle || f.jobTitle,
          location: p.location || f.location,
        }));
        if (p.avatarUrl) setAvatarUrl(p.avatarUrl);
        setSaved(false);
      } else {
        setSyncError(tp.syncError);
      }
    } catch {
      setSyncError(tp.syncError);
    } finally {
      setIsSyncing(false);
    }
  }

  const initials =
    (form.firstName?.[0] ?? '') + (form.lastName?.[0] ?? '') || '?';

  return (
    <div className="space-y-6">
      {/* Avatar + LinkedIn sync */}
      <div className="flex items-center gap-5">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="Profile photo"
            className="h-20 w-20 shrink-0 rounded-full border-2 border-zinc-200 object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-zinc-200 bg-zinc-50 text-lg font-semibold text-zinc-400">
            {initials.toUpperCase()}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleLinkedInSync}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-lg border border-[#0A66C2]/30 bg-[#0A66C2]/5 px-4 py-2.5 text-sm font-medium text-[#0A66C2] transition-colors hover:bg-[#0A66C2]/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            )}
            {isSyncing ? tp.syncing : tp.syncLinkedIn}
          </button>
          <p className="text-xs text-zinc-400">{tp.syncDescription}</p>
          {syncError && <p className="text-xs text-red-500">{syncError}</p>}
        </div>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-zinc-600">{tp.firstName}</Label>
          <Input
            value={form.firstName}
            onChange={(e) => set('firstName', e.target.value)}
            placeholder="Aurelien"
            className="border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-zinc-600">{tp.lastName}</Label>
          <Input
            value={form.lastName}
            onChange={(e) => set('lastName', e.target.value)}
            placeholder="Louvel"
            className="border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* Job title */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-zinc-600">{tp.jobTitle}</Label>
        <Input
          value={form.jobTitle}
          onChange={(e) => set('jobTitle', e.target.value)}
          placeholder="Product Designer"
          className="border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400"
        />
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-zinc-600">{tp.location}</Label>
        <Input
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
          placeholder={tp.locationPlaceholder}
          className="border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400"
        />
      </div>

      {/* Availability */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-zinc-600">{tp.availability}</Label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(tp.availabilityOptions) as [string, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => set('availability', value === form.availability ? '' : value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                form.availability === value
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Resume upload — design only */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-zinc-600">{tp.cv}</Label>
        <div className="flex cursor-not-allowed items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-6 py-8 opacity-50">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
              <Upload className="h-4 w-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-600">{tp.cvUpload}</p>
              <p className="mt-0.5 text-xs text-zinc-400">{tp.cvSubtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={isPending}
          variant="outline"
          className="border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <><Check className="h-4 w-4 text-green-500" /><span className="ml-1 text-green-600">{t.settings.saved}</span></>
          ) : (
            t.settings.save
          )}
        </Button>
      </div>
    </div>
  );
}
