import { readSettings, checkSourceConnected } from '@/lib/settings';
import { ALL_SOURCES } from '@/lib/sources';
import { SettingsShell } from '@/components/settings/SettingsShell';

export default async function SettingsPage() {
  const [settings, ...connectedResults] = await Promise.all([
    readSettings(),
    ...ALL_SOURCES.map((src) => checkSourceConnected(src)),
  ]);

  const statuses = Object.fromEntries(
    ALL_SOURCES.map((src, i) => [src, connectedResults[i]])
  );

  return <SettingsShell settings={settings} statuses={statuses} />;
}
