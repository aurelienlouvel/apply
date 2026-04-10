import type { Job } from '@/types/jobs';
import { JobCard } from './JobCard';

export function JobGrid({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-zinc-400">
        <p className="text-sm">No jobs found.</p>
        <p className="text-xs">Run <code className="rounded bg-zinc-100 px-1 py-0.5 text-zinc-600">pnpm scrape</code> to fetch listings.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
