import type { Metadata } from "next";
import Link from "next/link";

import PageContainer from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Jobs",
};

type SearchParams = Promise<{ q?: string; location?: string; type?: string }>;

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const location = params.location?.trim() ?? "";
  const type = params.type?.trim() ?? "";

  const [jobs, types] = await Promise.all([
    prisma.job.findMany({
      where: {
        ...(q
          ? { OR: [{ title: { contains: q } }, { company: { contains: q } }, { summary: { contains: q } }] }
          : {}),
        ...(location ? { location: { contains: location } } : {}),
        ...(type ? { type: { equals: type } } : {}),
      },
      include: {
        business: {
          include: {
            owner: {
              select: {
                subscriptionTier: true,
              },
            },
          },
        },
      },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.job.findMany({ select: { type: true }, distinct: ["type"], orderBy: { type: "asc" } }),
  ]);

  const scoredJobs = jobs
    .map((job) => {
      const tier = job.business?.owner?.subscriptionTier ?? "Free";
      const featured = job.manuallyFeatured || tier !== "Free";
      return { ...job, tier, featured };
    })
    .sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      const score = (tier: "Free" | "Growth" | "TownPartner") =>
        tier === "TownPartner" ? 2 : tier === "Growth" ? 1 : 0;
      return score(b.tier) - score(a.tier) || b.publishedAt.getTime() - a.publishedAt.getTime();
    });

  return (
    <PageContainer className="py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">Jobs in Tamworth</h1>
          <p className="text-muted-foreground">Local opportunities across retail, logistics, care, and more.</p>
        </div>
        <Button asChild>
          <Link href="/submit-job">Submit a job</Link>
        </Button>
      </div>

      <form className="mb-6 grid gap-3 rounded-xl border border-border/70 bg-card/60 p-4 md:grid-cols-[2fr_1fr_1fr_auto]">
        <Input name="q" placeholder="Search role or company" defaultValue={q} />
        <Input name="location" placeholder="Location" defaultValue={location} />
        <select
          name="type"
          defaultValue={type}
          className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
        >
          <option value="">All types</option>
          {types.map((item) => (
            <option key={item.type} value={item.type}>
              {item.type}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <Button type="submit">Filter</Button>
          <Button variant="outline" asChild>
            <Link href="/jobs">Reset</Link>
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {scoredJobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge variant="secondary">{job.type}</Badge>
                {job.salary && <Badge variant="outline">{job.salary}</Badge>}
                {job.featured && (
                  <Badge>{job.manuallyFeatured ? "Featured by admin" : job.tier === "TownPartner" ? "Partner featured" : "Featured"}</Badge>
                )}
              </div>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>
                {job.company} - {job.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{job.summary}</p>
              {job.closesAt && <p>Apply by: {job.closesAt.toLocaleDateString("en-GB")}</p>}
              <Button variant="outline" asChild>
                <Link href={`/jobs/${job.id}`}>View details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
