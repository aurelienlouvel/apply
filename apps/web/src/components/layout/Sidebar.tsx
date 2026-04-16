'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Briefcase01Icon,
  DashboardCircleIcon,
  GitBranchIcon,
  Globe02Icon,
  Logout01Icon,
  PanelLeftIcon,
  Sent02Icon,
  Settings01Icon,
  Add01Icon,
  User02Icon,
} from '@hugeicons/core-free-icons';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { AppSettings } from '@/lib/settings';
import type { JobGroup } from './AppShell';

/* ── Constants ────────────────────────────────────────────────────── */

const COLLAPSED_WIDTH = 56;
export const MIN_SIDEBAR_WIDTH = 180;
export const MAX_SIDEBAR_WIDTH = 360;

// icon width (16) + gap-2.5 (10) + px-2 (8) = 34 px → sub-item indent
const SUB_INDENT = 'pl-[34px]';

/* ── Logo SVG paths ───────────────────────────────────────────────── */

const TEXT_PATH =
  'M1144.12 217.973L1183.93 114.974H1230L1160.56 295.256C1155.73 308.01 1149.03 321.2 1138.48 331.208C1127.84 341.288 1113.43 348 1093.52 348C1084.33 348 1075.78 346.359 1069.79 344.356L1067.98 343.751V303.52L1071.58 304.911L1071.59 304.914C1071.6 304.918 1071.62 304.925 1071.64 304.934C1071.69 304.954 1071.78 304.983 1071.89 305.023C1072.11 305.102 1072.45 305.219 1072.88 305.36C1073.75 305.642 1075.02 306.022 1076.58 306.403C1079.71 307.169 1083.94 307.922 1088.44 307.922C1096.58 307.922 1102.32 306.125 1107.14 301.817C1112.11 297.387 1116.37 290.065 1120.95 278.355L1120.99 278.243L1121.05 278.137L1121.15 277.932L1055.57 114.974H1105.54L1144.12 217.973ZM731.441 112.423C755.671 112.423 775.728 121.474 789.703 137.105C803.652 152.709 811.369 174.67 811.369 200.233C811.369 225.996 803.15 248.045 788.592 263.678C774.019 279.328 753.263 288.363 728.579 288.363C711.441 288.363 695.517 282.571 685.116 272.993V345.449H639.746V114.974H685.116V129.732C695.582 119.102 712.463 112.423 731.441 112.423ZM914.758 112.423C938.988 112.423 959.046 121.473 973.021 137.105C986.971 152.709 994.686 174.67 994.686 200.233C994.685 225.995 986.469 248.045 971.911 263.678C957.338 279.328 936.58 288.363 911.895 288.363C894.758 288.363 878.836 282.573 868.435 272.995V345.449H823.065V114.974H868.435V129.729C878.901 119.101 895.781 112.423 914.758 112.423ZM541.477 112.423C563.751 112.423 582.244 118.785 595.201 130.443C608.19 142.129 615.362 158.91 615.362 179.185V237.547C615.362 241.915 616.202 244.561 617.383 246.076C618.461 247.459 620.13 248.285 622.887 248.285C623.8 248.285 624.996 248.149 626.037 247.994C626.542 247.919 626.982 247.842 627.295 247.786C635.543 246.305 661.716 229.604 661.716 229.604C661.716 229.604 645.254 287.724 609.212 287.724C600.394 287.724 592.488 285.64 586.472 281.28C582.04 278.068 578.751 273.695 576.888 268.261C567.162 280.866 548.104 288.363 526.21 288.363C491.843 288.363 466.001 267.525 466 237.867C466 222.641 471.54 210.175 481.963 200.95C492.308 191.794 507.261 186 525.858 183.566L558.909 179.104L559.665 178.985C563.365 178.352 565.865 177.13 567.445 175.574C569.073 173.97 569.991 171.752 569.991 168.66C569.991 158.652 560.148 148.993 541.477 148.992C532.858 148.992 525.515 151.268 520.234 155.338C515.002 159.371 511.625 165.289 511.044 173.005L510.86 175.463H466.652L466.971 172.52C468.947 154.188 476.883 139.091 489.799 128.603C502.692 118.134 520.337 112.423 541.477 112.423ZM1051.75 285.812H1006.38V48H1051.75V285.812ZM533.319 216.25L533.299 216.252C525.483 217.482 520.015 219.893 516.528 223.148C513.119 226.331 511.37 230.534 511.37 235.951C511.37 240.707 513.374 244.737 516.976 247.633C520.62 250.563 526.036 252.429 532.89 252.429C545.096 252.429 554.529 248.069 560.933 240.95C567.368 233.796 570.944 223.628 570.944 211.713V210.06L533.319 216.25ZM724.128 152.501C711.643 152.501 701.332 157.231 694.115 165.434C686.871 173.667 682.572 185.598 682.572 200.233C682.572 215.034 686.874 227.045 694.117 235.315C701.334 243.555 711.644 248.285 724.128 248.285C736.274 248.284 746.423 243.568 753.569 235.326C760.742 227.052 765.044 215.035 765.044 200.233C765.044 185.598 760.747 173.66 753.574 165.424C746.427 157.217 736.275 152.502 724.128 152.501ZM907.444 152.501C894.959 152.501 884.649 157.231 877.431 165.434C870.187 173.667 865.891 185.598 865.891 200.233C865.891 215.034 870.192 227.045 877.436 235.315C884.653 243.554 894.96 248.285 907.444 248.285C919.591 248.285 929.741 243.569 936.888 235.326C944.06 227.052 948.363 215.035 948.363 200.233C948.363 185.598 944.065 173.66 936.893 165.424C929.746 157.216 919.592 152.501 907.444 152.501Z';

const ICON_PATH =
  'M305.446 104C311.182 104 316.053 108.675 316.922 115.06C320.789 143.482 331.189 219.414 336.89 256.226L376.912 223.214C382.627 218.501 389.205 226.979 384.256 232.686C361.599 258.809 336.534 287.203 324.477 299.143C321.614 301.979 317.551 300.418 316.52 296.284C305.791 253.234 290.208 179.201 284.508 151.82C283.231 145.683 278.258 141.442 272.667 141.723L185.916 146.089C170.431 146.868 155.77 154.551 146.961 168.913C137.199 184.828 124.688 208.542 116.231 236.673C114.987 240.809 117.787 245.019 121.664 244.923C184.751 243.362 214.688 222.428 246.201 183.302C248.249 180.759 252.018 181.754 252.795 185.074C278.214 293.786 211.561 316.018 59.5191 298.755C50.5632 297.738 44.3155 288.227 46.4044 278.367C58.8702 219.527 81.1871 174.152 99.4481 144.458C116.428 116.847 145.4 104 175.225 104L305.446 104Z';

/* ── Nav primitives ───────────────────────────────────────────────── */

/** Simple nav link (no sub-items, no [+] button) — used for Home. */
function NavLink({
  href,
  label,
  icon,
  collapsed,
}: {
  href: string;
  label: string;
  icon: typeof DashboardCircleIcon;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== '/' && pathname.startsWith(href + '/'));

  const el = (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
        collapsed && 'justify-center',
        active
          ? 'bg-accent text-accent-foreground font-medium'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      <HugeiconsIcon icon={icon} size={16} className="shrink-0" />
      {!collapsed && label}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={el} />
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return el;
}

/**
 * Nav section — same header style as NavLink, but with:
 * • a [+] button that fades in on hover of the header row
 * • optional inline badges (e.g. accepted / rejected counts)
 * • sub-items rendered below
 */
function NavSection({
  href,
  label,
  icon,
  collapsed,
  addHref,
  badges,
  children,
}: {
  href: string;
  label: string;
  icon: typeof DashboardCircleIcon;
  collapsed: boolean;
  addHref: string;
  badges?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');

  // Collapsed: just the icon with a tooltip, no sub-items
  if (collapsed) {
    const el = (
      <Link
        href={href}
        className={cn(
          'flex justify-center rounded-md px-2 py-1.5 transition-colors',
          active
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <HugeiconsIcon icon={icon} size={16} className="shrink-0" />
      </Link>
    );
    return (
      <Tooltip>
        <TooltipTrigger render={el} />
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div>
      {/* Header row — group/section scoped to this row only */}
      <div className="group/section relative">
        <Link
          href={href}
          className={cn(
            'flex items-center gap-2.5 rounded-md px-2 py-1.5 pr-8 text-sm transition-colors',
            active
              ? 'bg-accent text-accent-foreground font-medium'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <HugeiconsIcon icon={icon} size={16} className="shrink-0" />
          <span className="flex-1 truncate">{label}</span>
          {badges}
        </Link>
        {/* [+] button — absolutely positioned over the right side of the header row */}
        <Link
          href={addHref}
          className="absolute right-1.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded text-muted-foreground opacity-0 transition-opacity hover:bg-accent group-hover/section:opacity-100"
          aria-label={`Add to ${label}`}
        >
          <HugeiconsIcon icon={Add01Icon} size={12} />
        </Link>
      </div>

      {/* Sub-items */}
      {children && <div className="flex flex-col">{children}</div>}
    </div>
  );
}

/** Indented sub-item row — no icon, no dash, optional right element. */
function SubItem({
  label,
  right,
}: {
  label: string;
  right?: React.ReactNode;
}) {
  return (
    <div className={cn('flex items-center gap-2 py-[3px] pr-2', SUB_INDENT)}>
      <span className="flex-1 truncate text-xs text-muted-foreground">{label}</span>
      {right && <span className="shrink-0">{right}</span>}
    </div>
  );
}

/** Sub-item placeholder when a section has no data yet. */
function EmptySubItem({ label }: { label: string }) {
  return (
    <div className={cn('py-[3px] pr-2', SUB_INDENT)}>
      <span className="text-xs italic text-muted-foreground/40">{label}</span>
    </div>
  );
}

/* ── Sidebar ──────────────────────────────────────────────────────── */

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  width: number;
  onWidthChange: (width: number) => void;
  settings: AppSettings;
  jobGroups: JobGroup[];
}

export function Sidebar({
  collapsed,
  onToggle,
  width,
  onWidthChange,
  settings,
  jobGroups,
}: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t, locale, setLocale } = useLocale();
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleWhatsNew = useCallback(() => setWhatsNewOpen(true), []);

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = width;

      setIsDragging(true);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      const onMouseMove = (e: MouseEvent) => {
        const newWidth = Math.min(
          Math.max(startWidth + (e.clientX - startX), MIN_SIDEBAR_WIDTH),
          MAX_SIDEBAR_WIDTH
        );
        onWidthChange(newWidth);
      };

      const onMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [width, onWidthChange]
  );

  if (pathname === '/login') return null;

  const user = session?.user;
  const initials = user?.name
    ? user.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <>
      <aside
        style={{ width: collapsed ? COLLAPSED_WIDTH : width }}
        className={cn(
          'relative flex h-screen shrink-0 flex-col border-r border-border bg-background px-2 py-4 overflow-hidden',
          !isDragging && 'transition-[width] duration-200 ease-in-out'
        )}
      >
        {/* Logo + toggle */}
        <div
          className={cn(
            'mb-6 px-2',
            collapsed ? 'flex justify-center' : 'flex items-center justify-between gap-2'
          )}
        >
          {!collapsed && (
            <Link href="/" aria-label="Apply home">
              <svg
                viewBox="34 38 1206 320"
                className="h-5 w-auto shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={TEXT_PATH} fill="currentColor" />
                <path d={ICON_PATH} fill="#E2B8FF" />
              </svg>
            </Link>
          )}
          <button
            onClick={onToggle}
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Toggle sidebar"
          >
            <HugeiconsIcon
              icon={PanelLeftIcon}
              size={16}
              className={cn('transition-transform duration-200', collapsed && 'rotate-180')}
            />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
          {/* Home — simple link, no sub-items */}
          <NavLink
            href="/"
            label={t.nav.home ?? 'Home'}
            icon={DashboardCircleIcon}
            collapsed={collapsed}
          />

          {/* Profile */}
          <NavSection
            href="/settings"
            label="Profile"
            icon={User02Icon}
            collapsed={collapsed}
            addHref="/settings"
          >
            {settings.searchTitles.length > 0 ? (
              settings.searchTitles.map((title) => <SubItem key={title} label={title} />)
            ) : (
              <EmptySubItem label="No search titles" />
            )}
          </NavSection>

          {/* Offers */}
          <NavSection
            href="/offers"
            label={t.nav.offers ?? 'Offers'}
            icon={Briefcase01Icon}
            collapsed={collapsed}
            addHref="/settings"
          >
            {jobGroups.length > 0 ? (
              jobGroups.map(({ label, count }) => (
                <SubItem
                  key={label}
                  label={label}
                  right={
                    count > 0 ? (
                      <span className="rounded bg-muted px-1 py-px text-[10px] font-medium text-muted-foreground">
                        {count}
                      </span>
                    ) : null
                  }
                />
              ))
            ) : (
              <EmptySubItem label="No offers scraped yet" />
            )}
          </NavSection>

          {/* Applications */}
          <NavSection
            href="/applications"
            label={t.nav.applications ?? 'Applications'}
            icon={Sent02Icon}
            collapsed={collapsed}
            addHref="/applications"
            badges={
              <span className="ml-0.5 flex shrink-0 items-center gap-0.5">
                <span className="rounded bg-muted px-1 py-px text-[10px] font-medium text-muted-foreground">
                  0 ✓
                </span>
                <span className="rounded bg-muted px-1 py-px text-[10px] font-medium text-muted-foreground">
                  0 ✗
                </span>
              </span>
            }
          >
            <EmptySubItem label="No applications yet" />
          </NavSection>

          {/* Processes */}
          <NavSection
            href="/processes"
            label={t.nav.processes ?? 'Processes'}
            icon={GitBranchIcon}
            collapsed={collapsed}
            addHref="/processes"
          >
            <EmptySubItem label="No active processes" />
          </NavSection>
        </nav>

        {/* Profile / account */}
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
                    <span className="text-[10px] font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem render={<Link href="/settings" />} className="gap-2">
              <HugeiconsIcon icon={Settings01Icon} size={14} />
              {t.menu.settings}
            </DropdownMenuItem>

            <div className="flex items-center gap-2 px-1.5 py-1">
              <HugeiconsIcon icon={Globe02Icon} size={14} className="shrink-0 text-muted-foreground" />
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
              <HugeiconsIcon icon={Logout01Icon} size={14} />
              {t.menu.signOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Resize handle */}
        {!collapsed && (
          <div
            onMouseDown={handleResizeMouseDown}
            className={cn(
              'absolute right-0 top-0 h-full w-1 cursor-col-resize transition-colors',
              isDragging ? 'bg-border' : 'hover:bg-border'
            )}
          />
        )}
      </aside>

      <WhatsNew open={whatsNewOpen} onOpenChange={setWhatsNewOpen} />
    </>
  );
}
