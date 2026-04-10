'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  Radar,
  LogOut,
  Globe,
  PanelLeft,
  LayoutDashboard,
  Send,
  GitBranch,
  Settings,
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';
import { useLocale } from '@/components/providers/Providers';
import { WhatsNew } from '@/components/changelog/WhatsNew';
import { CURRENT_VERSION } from '@/lib/changelog';
import { LOCALES } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t, locale, setLocale } = useLocale();
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);

  const handleWhatsNew = useCallback(() => setWhatsNewOpen(true), []);

  if (pathname === '/login') return null;

  const user = session?.user;
  const initials = user?.name
    ? user.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const NAV = [
    { href: '/', label: t.nav.home ?? 'Home', icon: LayoutDashboard },
    { href: '/offers', label: t.nav.offers ?? 'Offers', icon: Briefcase },
    { href: '/applications', label: t.nav.applications ?? 'Applications', icon: Send },
    { href: '/processes', label: t.nav.processes ?? 'Processes', icon: GitBranch },
  ];

  return (
    <>
      <aside
        className={cn(
          'flex h-screen shrink-0 flex-col border-r border-border bg-background px-2 py-4 transition-[width] duration-200 ease-in-out overflow-hidden',
          collapsed ? 'w-14' : 'w-56'
        )}
      >
        {/* Logo + toggle */}
        <div className="mb-6 flex items-center justify-between px-2">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Radar className="size-4 shrink-0 text-foreground" />
              <span className="text-sm font-semibold tracking-tight text-foreground">Apply</span>
            </div>
          )}
          {collapsed && <Radar className="mx-auto size-4 text-foreground" />}
          <button
            onClick={onToggle}
            className={cn(
              'flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
              collapsed && 'mx-auto mt-0'
            )}
            aria-label="Toggle sidebar"
          >
            <PanelLeft className={cn('size-4 transition-transform duration-200', collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            const item = (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
                  collapsed ? 'justify-center' : '',
                  active
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed && label}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={href}>
                  <TooltipTrigger render={item} />
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              );
            }
            return item;
          })}
        </nav>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              'flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent outline-none',
              collapsed ? 'justify-center' : 'gap-2.5'
            )}
          >
            <Avatar size="sm">
              <AvatarImage src={user?.image ?? ''} alt={user?.name ?? ''} />
              <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <span className="flex-1 truncate text-left text-xs font-medium text-foreground">
                {user?.name ?? t.menu.signIn}
              </span>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="start" sideOffset={6}>
            {user && (
              <>
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-foreground">{user.name}</span>
                  {user.email && (
                    <span className="text-[10px] font-normal text-muted-foreground">{user.email}</span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem render={<Link href="/settings" />} className="gap-2">
              <Settings className="size-3.5" />
              {t.menu.settings}
            </DropdownMenuItem>

            {/* Language inline */}
            <div className="flex items-center gap-2 px-1.5 py-1">
              <Globe className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="flex-1 text-sm text-muted-foreground">{t.menu.language}</span>
              <div className="flex gap-1">
                {LOCALES.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLocale(l.value)}
                    className={cn(
                      'rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                      locale === l.value
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {l.value.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <DropdownMenuItem onSelect={handleWhatsNew} className="gap-2">
              <span>✦</span>
              {t.menu.whatsNew}
              <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                v{CURRENT_VERSION}
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onSelect={() => signOut({ callbackUrl: '/login' })}
              className="gap-2"
            >
              <LogOut className="size-3.5" />
              {t.menu.signOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </aside>

      <WhatsNew open={whatsNewOpen} onOpenChange={setWhatsNewOpen} />
    </>
  );
}
