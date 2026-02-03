export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateJobPopover from "../jobs/CreateJob";

export default async function CompanyDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "COMPANY") {
    redirect("/dashboard");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: {
      verification: true,
    },
  });

  if (!profile?.verification || profile.verification.status !== "VERIFIED") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">
            Company Not Verified
          </h1>
          <p className="text-slate-600">
            You must verify your company before posting jobs.
          </p>

          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-lg bg-eduBlue px-6 py-2 text-white font-medium hover:bg-blue-700"
          >
            Verify Company
          </Link>
        </div>
      </div>
    );
  }

  const jobs = await prisma.jobPosting.findMany({
    where: { userId: user.id },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: [
      {
        applications: {
          _count: "desc",
        },
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const jobCategories = await prisma.jobCategory.findMany({
    orderBy: { name: "asc" },
  });

  const totalApplicants = jobs.reduce(
    (sum, job) => sum + job._count.applications,
    0,
  );

  const hiredCount = jobs.reduce((sum, job) => sum + job.hired, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Company Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your job postings and applicants
          </p>
        </div>

        <CreateJobPopover categories={jobCategories} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Stat label="Jobs Posted" value={jobs.length} />
        <Stat label="Applicants" value={totalApplicants} />
        <Stat label="Hired" value={hiredCount} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Your Job Posts</h2>
          <span className="text-sm text-slate-500">{jobs.length} total</span>
        </div>

        {jobs.length ? (
          <div className="divide-y">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
              >
                <div className="space-y-1">
                  <p className="font-medium text-slate-900">
                    {job.title}
                    {job.status === "DRAFT" && (
                      <span className="ml-2 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        Draft
                      </span>
                    )}
                  </p>

                  <p className="text-sm text-slate-500">
                    {job._count.applications} applicants
                  </p>
                </div>

                <Link
                  href={`/company/jobs/${job.slug}`}
                  className="text-sm font-medium text-eduBlue hover:underline"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-slate-500">
            No job postings yet.
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
