import { cn } from "@/lib/utils";

type LevelName =
  | "Junior"
  | "Confirmed"
  | "Senior"
  | "Lead"
  | "Manager"
  | "Consultant"
  | "Founding";
type LevelColor = "yellow" | "orange" | "red" | "violet";

interface LevelConfig {
  bars: number;
  color: LevelColor;
}

const LEVEL_CONFIG: Record<LevelName, LevelConfig> = {
  Junior: { bars: 1, color: "yellow" },
  Confirmed: { bars: 2, color: "orange" },
  Senior: { bars: 3, color: "red" },
  Consultant: { bars: 3, color: "red" },
  Lead: { bars: 4, color: "violet" },
  Manager: { bars: 4, color: "violet" },
  Founding: { bars: 4, color: "violet" },
};

const COLOR_CLASSES: Record<LevelColor, { bar: string; text: string }> = {
  yellow: { bar: "bg-yellow-400", text: "text-yellow-500" },
  orange: { bar: "bg-orange-400", text: "text-orange-500" },
  red: { bar: "bg-red-400", text: "text-red-500" },
  violet: { bar: "bg-violet-500", text: "text-violet-500" },
};

const BAR_HEIGHTS = ["h-3.5", "h-3.75", "h-4", "h-4.25"] as const;

interface LevelIndicatorProps {
  level: LevelName;
  className?: string;
}

export function LevelIndicator({ level, className }: LevelIndicatorProps) {
  const cfg = LEVEL_CONFIG[level] ?? { bars: 1, color: "yellow" as LevelColor };
  const colors = COLOR_CLASSES[cfg.color];

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div className="flex items-end gap-0.75">
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={cn(
              "w-1.5 rounded-xs transition-colors",
              h,
              i < cfg.bars ? colors.bar : "bg-zinc-200",
            )}
          />
        ))}
      </div>
      <span className={cn("text-xs font-medium", colors.text)}>{level}</span>
    </div>
  );
}
