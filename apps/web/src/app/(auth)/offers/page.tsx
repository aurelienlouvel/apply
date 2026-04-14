import { readJobs } from '@/lib/jobs';
import { JobTable } from '@/components/jobs/JobTable';

export default async function OffersPage() {
  const { jobs } = await readJobs();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <JobTable jobs={jobs} />
      </div>
    </div>
  );
}
