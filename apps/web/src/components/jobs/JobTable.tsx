'use client';

import { useState, useCallback } from 'react';
import { JobRow } from '@/components/jobs/JobRow';
import { JobDetail } from '@/components/jobs/JobDetail';
import type { Job } from '@/types/jobs';

export type JobStatus = 'unreviewed' | 'applied' | 'declined';

interface JobTableProps {
  jobs: Job[];
}

export function JobTable({ jobs }: JobTableProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [statuses, setStatuses] = useState<Record<string, JobStatus>>({});

  const handleDecline = useCallback((id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: 'declined' }));
    setSelectedJob((prev) => (prev?.id === id ? null : prev));
  }, []);

  const handleApply = useCallback((id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: 'applied' }));
  }, []);

  const visible = jobs.filter((j) => statuses[j.id] !== 'declined');

  return (
    <>
      {/* Page header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/90 px-6 py-4 backdrop-blur">
        <h1 className="text-lg font-semibold text-foreground">
          Offers{' '}
          <span className="text-sm font-normal text-muted-foreground">({visible.length})</span>
        </h1>
      </div>

      {visible.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-zinc-400">
          <p className="text-sm">No offers found.</p>
          <p className="text-xs">
            Run{' '}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-zinc-600">pnpm scrape</code>{' '}
            to fetch new offers.
          </p>
        </div>
      ) : (
        <div role="table" className="w-full min-w-[1100px]">
          <div role="rowgroup" className="divide-y divide-border">
            {visible.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                status={statuses[job.id] ?? 'unreviewed'}
                onSelect={setSelectedJob}
                onDecline={handleDecline}
                onApply={handleApply}
              />
            ))}
          </div>
        </div>
      )}

      <JobDetail
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onApply={handleApply}
      />
    </>
  );
}
