'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabProfile } from '@/components/settings/TabProfile';
import { TabSearchCriteria } from '@/components/settings/TabSearchCriteria';
import { TabPlatforms } from '@/components/settings/TabPlatforms';
import { useLocale } from '@/components/providers/Providers';
import type { AppSettings } from '@/lib/settings';

interface SettingsShellProps {
  settings: AppSettings;
  statuses: Record<string, boolean>;
}

export function SettingsShell({ settings, statuses }: SettingsShellProps) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-zinc-900">{t.settings.title}</h1>
        <p className="mt-1 text-sm text-zinc-500">{t.settings.subtitle}</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList
          variant="line"
          className="mb-6 w-full justify-start border-b border-zinc-200 pb-0"
        >
          {[
            { value: 'profile', label: t.settings.tabs.profile },
            { value: 'criteria', label: t.settings.tabs.criteria },
            { value: 'platforms', label: t.settings.tabs.platforms },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-0 text-sm text-zinc-500 shadow-none transition-colors data-active:border-zinc-900 data-active:font-medium data-active:text-zinc-900"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <TabProfile settings={settings} />
        </TabsContent>

        <TabsContent value="criteria">
          <TabSearchCriteria settings={settings} />
        </TabsContent>

        <TabsContent value="platforms">
          <TabPlatforms statuses={statuses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
