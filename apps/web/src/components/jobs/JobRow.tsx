"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building06Icon,
  Location06Icon,
  Clock01Icon,
  Cancel01Icon,
  Tick01Icon,
  Wifi01Icon,
  ShuffleIcon,
  CloudIcon,
  ChartIncreaseIcon,
  BookOpen01Icon,
  ShoppingCart01Icon,
  HeartCheckIcon,
  PaintBoardIcon,
  Globe02Icon,
  LaptopIcon,
  JusticeScale01Icon,
  Leaf01Icon,
  UserGroupIcon,
  Money01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, parseWorkMode, parseLocation } from "@/lib/utils";
import type { Job } from "@/types/jobs";
import type { JobStatus } from "@/components/jobs/JobTable";

interface JobRowProps {
  job: Job;
  status: JobStatus;
  onSelect: (job: Job) => void;
  onDecline: (id: string) => void;
  onApply: (id: string) => void;
}

/* ── Work mode ──────────────────────────────────────────────────────────── */
type WorkMode = "onsite" | "hybrid" | "remote";

const WORK_MODE_CONFIG: Record<
  WorkMode,
  { icon: typeof Building06Icon; label: string; cls: string }
> = {
  onsite: {
    icon: Building06Icon,
    label: "On-Site",
    cls: "border-zinc-200 bg-zinc-50 text-zinc-500",
  },
  hybrid: {
    icon: ShuffleIcon,
    label: "Hybrid",
    cls: "border-slate-200 bg-slate-50 text-slate-500",
  },
  remote: {
    icon: Wifi01Icon,
    label: "Remote",
    cls: "border-sky-100 bg-sky-50 text-sky-500",
  },
};

/* Work mode combinations for sample data variety */
const FAKE_WORK_MODES: WorkMode[][] = [
  ["onsite"],
  ["hybrid"],
  ["remote"],
  ["onsite", "hybrid"],
  ["hybrid", "remote"],
  ["onsite"],
  ["hybrid"],
  ["remote"],
  ["onsite", "hybrid"],
];

/* ── Experience levels ──────────────────────────────────────────────────── */
const LEVEL_OPTIONS = [
  "Junior",
  "Mid-Level",
  "Senior",
  "Manager",
  "Founder",
] as const;
type Level = (typeof LEVEL_OPTIONS)[number];

const LEVEL_COLORS: Record<Level, string> = {
  Junior: "border-sky-200 bg-sky-50 text-sky-700",
  "Mid-Level": "border-indigo-200 bg-indigo-50 text-indigo-700",
  Senior: "border-orange-200 bg-orange-50 text-orange-700",
  Manager: "border-rose-200 bg-rose-50 text-rose-700",
  Founder: "border-purple-200 bg-purple-50 text-purple-700",
};

/* ── Sectors ────────────────────────────────────────────────────────────── */
type SectorKey =
  | "SaaS"
  | "FinTech"
  | "EdTech"
  | "E-Commerce"
  | "HealthTech"
  | "Studio"
  | "Agency"
  | "IT Services"
  | "LegalTech"
  | "GreenTech";

const SECTOR_OPTIONS: SectorKey[] = [
  "SaaS",
  "FinTech",
  "EdTech",
  "E-Commerce",
  "HealthTech",
  "Studio",
  "Agency",
  "IT Services",
  "LegalTech",
  "GreenTech",
];

const SECTOR_CONFIG: Record<
  SectorKey,
  { icon: typeof Building06Icon; cls: string }
> = {
  SaaS: { icon: CloudIcon, cls: "border-blue-200 bg-blue-50 text-blue-700" },
  FinTech: {
    icon: ChartIncreaseIcon,
    cls: "border-green-200 bg-green-50 text-green-700",
  },
  EdTech: {
    icon: BookOpen01Icon,
    cls: "border-amber-200 bg-amber-50 text-amber-700",
  },
  "E-Commerce": {
    icon: ShoppingCart01Icon,
    cls: "border-orange-200 bg-orange-50 text-orange-700",
  },
  HealthTech: {
    icon: HeartCheckIcon,
    cls: "border-pink-200 bg-pink-50 text-pink-700",
  },
  Studio: {
    icon: PaintBoardIcon,
    cls: "border-purple-200 bg-purple-50 text-purple-700",
  },
  Agency: {
    icon: Globe02Icon,
    cls: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
  "IT Services": {
    icon: LaptopIcon,
    cls: "border-slate-200 bg-slate-50 text-slate-700",
  },
  LegalTech: {
    icon: JusticeScale01Icon,
    cls: "border-rose-200 bg-rose-50 text-rose-700",
  },
  GreenTech: {
    icon: Leaf01Icon,
    cls: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};

/* ── Fake data pools ────────────────────────────────────────────────────── */
const FAKE_SIZES = ["2–10", "11–50", "51–200", "201–500", "500–1k", "1k+"];
const FAKE_SALARIES: (string | null)[] = [
  null,
  null,
  "35–45K",
  "40–55K",
  "45–60K",
  "55–75K",
  "70–90K",
  "80–100K+",
];
const FAKE_CONTRACTS = [
  "Full-Time",
  "Full-Time",
  "Full-Time",
  "Part-Time",
  "Freelance",
  "Internship",
];
const FAKE_DATES = [
  "Today",
  "Yesterday",
  "2d ago",
  "3d ago",
  "5d ago",
  "1w ago",
  "2w ago",
];

const CONN_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-teal-100 text-teal-700",
  "bg-rose-100 text-rose-700",
];
const CONN_INITIALS = [
  "AM",
  "JD",
  "MC",
  "PL",
  "SR",
  "TC",
  "VB",
  "NF",
  "KH",
  "RL",
];

/* ── Helpers ────────────────────────────────────────────────────────────── */
function pick<T>(arr: readonly T[], seed: string, offset = 0): T {
  let hash = offset;
  for (let i = 0; i < seed.length; i++)
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  return arr[Math.abs(hash) % arr.length];
}

function pickInt(max: number, seed: string, offset = 0): number {
  let hash = offset;
  for (let i = 0; i < seed.length; i++)
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  return Math.abs(hash) % (max + 1);
}

/* ── Component ──────────────────────────────────────────────────────────── */
export function JobRow({
  job,
  status,
  onSelect,
  onDecline,
  onApply,
}: JobRowProps) {
  const realMode = parseWorkMode(job.location);
  const cleanLocation = parseLocation(job.location);
  const initials = job.company
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  /* Seeded fake data */
  const level = pick(LEVEL_OPTIONS, job.id, 0);
  const sector = pick(SECTOR_OPTIONS, job.id, 1);
  const teamSize = pick(FAKE_SIZES, job.id, 2);
  const fakeSalary = pick(FAKE_SALARIES, job.id, 4) ?? job.salary ?? null;
  const contract = job.contract || pick(FAKE_CONTRACTS, job.id, 5);
  const postedAt = job.postedAt || pick(FAKE_DATES, job.id, 6);
  const connCount = pickInt(3, job.id, 7);

  /* Work modes: use real if available, else seed from fake pool */
  const workModes: WorkMode[] = realMode
    ? [realMode]
    : pick(FAKE_WORK_MODES, job.id, 9);

  /* Connection avatars */
  const connectionAvatars = Array.from({ length: connCount }, (_, i) => ({
    initials: pick(CONN_INITIALS, job.id, 8 + i),
    color: pick(CONN_COLORS, job.id, 20 + i),
  }));

  const sectorCfg = SECTOR_CONFIG[sector];
  const isApplied = status === "applied";

  return (
    <div
      role="row"
      onClick={() => onSelect(job)}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-0 px-6 py-5 transition-colors hover:bg-zinc-50/80",
        isApplied && "border-l-2 border-emerald-400 pl-[calc(1.5rem-2px)]",
      )}
    >
      {/* ── Col 1 — Company (w-64) ─────────────────────────────────────── */}
      <div className="flex w-64 shrink-0 flex-col gap-1 pr-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-zinc-100 text-xs font-bold text-zinc-600">
            {initials}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="truncate text-sm font-semibold leading-snug text-foreground">
              {job.company}
            </p>
            <p className="truncate text-xs leading-snug text-muted-foreground">
              {job.title}
            </p>
          </div>
        </div>
        {/* Level + salary */}
        <div className="flex flex-wrap items-center gap-1.5 pl-[calc(2.5rem+0.75rem)]">
          <Badge
            variant="outline"
            className={cn(
              "rounded-full text-[10px] font-medium",
              LEVEL_COLORS[level],
            )}
          >
            {level}
          </Badge>
          {fakeSalary && (
            <Badge
              variant="outline"
              className="gap-0.5 rounded-full border-green-200 bg-green-50 text-[10px] font-medium text-green-700"
            >
              <HugeiconsIcon
                icon={Money01Icon}
                size={10}
                className="shrink-0"
              />
              {fakeSalary}
            </Badge>
          )}
        </div>
      </div>

      {/* ── Col 2 — Contract (w-24) ────────────────────────────────────── */}
      <div className="w-24 shrink-0 pr-4">
        <Badge variant="outline" className="rounded-full text-xs">
          {contract}
        </Badge>
      </div>

      {/* ── Col 3 — Sector (w-32) ──────────────────────────────────────── */}
      <div className="w-32 shrink-0 pr-4">
        <Badge
          variant="outline"
          className={cn(
            "gap-1 rounded-md text-[11px] font-medium",
            sectorCfg.cls,
          )}
        >
          <HugeiconsIcon icon={sectorCfg.icon} size={12} className="shrink-0" />
          {sector}
        </Badge>
      </div>

      {/* ── Col 4 — Team + connections (w-32) ──────────────────────────── */}
      <div className="w-32 shrink-0 pr-4">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <HugeiconsIcon
              icon={UserGroupIcon}
              size={12}
              className="shrink-0 text-zinc-400"
            />
            {teamSize}
          </span>
          {connCount > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1.5">
                {connectionAvatars.map((c, i) => (
                  <div
                    key={i}
                    title={c.initials}
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold",
                      c.color,
                    )}
                  >
                    {c.initials}
                  </div>
                ))}
              </div>
              <span className="text-[10px] text-zinc-400">{connCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Col 5 — Location + Work mode (flex-[1.5]) ──────────────────── */}
      <div className="min-w-0 flex-[1.5] pr-4">
        <div className="flex flex-col gap-2">
          {cleanLocation && (
            <span className="flex items-center gap-1 text-xs text-zinc-600">
              <HugeiconsIcon
                icon={Location06Icon}
                size={12}
                className="shrink-0 text-zinc-400"
              />
              <span className="truncate">{cleanLocation}</span>
            </span>
          )}
          <div className="flex flex-wrap gap-1">
            {workModes.map((mode) => {
              const { icon, label, cls } = WORK_MODE_CONFIG[mode];
              return (
                <Badge
                  key={mode}
                  variant="outline"
                  className={cn(
                    "gap-1 rounded-md text-[11px] font-medium",
                    cls,
                  )}
                >
                  <HugeiconsIcon icon={icon} size={12} className="shrink-0" />
                  {label}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Col 6 — Posted (w-20) ──────────────────────────────────────── */}
      <div className="w-20 shrink-0 pr-4">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <HugeiconsIcon icon={Clock01Icon} size={12} className="shrink-0" />
          {postedAt}
        </span>
      </div>

      {/* ── Col 7 — Actions (w-44) ─────────────────────────────────────── */}
      <div className="flex w-44 shrink-0 items-center justify-end gap-2">
        <Button
          variant="outline"
          size="xs"
          onClick={(e) => {
            e.stopPropagation();
            onDecline(job.id);
          }}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={12} />
          Pass
        </Button>

        {isApplied ? (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <HugeiconsIcon icon={Tick01Icon} size={14} />
            Applied
          </span>
        ) : (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              onApply(job.id);
            }}
            className={cn(buttonVariants({ size: "xs" }), "gap-1")}
          >
            Apply
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
