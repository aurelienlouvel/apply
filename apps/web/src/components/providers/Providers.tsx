'use client';

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { createContext, useContext, useEffect, useState } from 'react';
import type { Locale, T } from '@/lib/i18n';
import { translations } from '@/lib/i18n';

// ── Locale context ──────────────────────────────────────────────────────────

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: T;
}

const DEFAULT_LOCALE: Locale = 'en';

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: translations[DEFAULT_LOCALE] as unknown as T,
});

export function useLocale() {
  return useContext(LocaleContext);
}

function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = localStorage.getItem('apply-locale') as Locale | null;
    if (saved === 'en' || saved === 'fr') setLocaleState(saved);
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem('apply-locale', l);
    document.documentElement.lang = l;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: translations[locale] as unknown as T }}>
      {children}
    </LocaleContext.Provider>
  );
}

// ── Combined providers ───────────────────────────────────────────────────────

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <LocaleProvider>{children}</LocaleProvider>
    </SessionProvider>
  );
}
