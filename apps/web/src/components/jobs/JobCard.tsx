import { MapPin, ExternalLink, Clock, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SOURCE_META } from "@/lib/sources";
import { excerptDescription, cn } from "@/lib/utils";
import type { Job } from "@/types/jobs";

export function JobCard({ job }: { job: Job }) {
  const source = SOURCE_META[job.source];
  const excerpt = excerptDescription(job.description);

  return (
    <Card className="group flex flex-col gap-0 border-zinc-200 bg-white shadow-none transition-colors hover:border-zinc-300 hover:bg-zinc-50">
      <CardHeader className="pb-3">
        {/* Source badge + posted date */}
        <div className="flex items-start justify-between gap-2">
          <Badge
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium shrink-0",
              source.badgeCls,
            )}
          >
            {source.label}
          </Badge>
          {job.postedAt && (
            <span className="flex items-center gap-1 text-xs text-zinc-400 shrink-0">
              <Clock className="h-3 w-3" />
              {job.postedAt}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-zinc-900">
          {job.title}
        </h3>

        {/* Company */}
        <p className="text-sm font-medium text-zinc-500">{job.company}</p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        {/* Pills row */}
        <div className="flex flex-wrap items-center gap-1.5">
          {job.location && (
            <span className="flex items-center gap-1 rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
          )}
          {job.contract && (
            <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500">
              {job.contract}
            </span>
          )}
          {job.salary && (
            <span className="flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs text-green-700">
              <Banknote className="h-3 w-3" />
              {job.salary}
            </span>
          )}
        </div>

        {/* Description excerpt */}
        {excerpt && (
          <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-zinc-400">
            {excerpt}
          </p>
        )}

        {/* Footer: apply button */}
      </CardContent>
    </Card>
  );
}
