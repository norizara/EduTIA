import Jobs from "@/components/jobs/Jobs";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JobUI } from "@/types/job.ui";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value) {
      params.set(key, value);
    }
  }

  const categories = await prisma.jobCategory.findMany();

  const jobs: JobUI[] = await prisma.jobPosting.findMany({
    where: { status: "PUBLISHED" },
    include: {
      category: true,
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  return <Jobs jobs={jobs} categories={categories} isAuthenticated={!!user} />;
}
