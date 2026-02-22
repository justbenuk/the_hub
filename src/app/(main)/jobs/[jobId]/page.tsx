/* eslint-disable react-hooks/purity */

import Link from "next/link";
import { notFound } from "next/navigation";

import PageContainer from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ jobId: string }>;

export default async function JobDetailPage({ params }: { params: Params }) {
  const { jobId } = await params;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      business: {
        include: {
          owner: { select: { subscriptionTier: true } },
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  await prisma.jobInteraction.create({ data: { jobId: job.id, type: "View" } });

  const interactions = await prisma.jobInteraction.findMany({
    where: { jobId: job.id, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
  });
  const views = interactions.filter((item) => item.type === "View").length;
  const clicks = interactions.filter((item) => item.type === "Click").length;

  const tier = job.business?.owner?.subscriptionTier ?? "Free";
  const featured = job.manuallyFeatured || tier !== "Free";

  return (
    <PageContainer className="py-12">
      <Card>
        <CardHeader>
          <div className="mb-2 flex gap-2">
            <Badge variant="secondary">{job.type}</Badge>
            {featured && <Badge>{job.manuallyFeatured ? "Featured by admin" : tier === "TownPartner" ? "Partner featured" : "Featured"}</Badge>}
          </div>
          <CardTitle className="text-3xl">{job.title}</CardTitle>
          <CardDescription>
            {job.company} - {job.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>{job.summary}</p>
          {job.salary && <p>Salary: {job.salary}</p>}
          {job.closesAt && <p>Apply by: {job.closesAt.toLocaleDateString("en-GB")}</p>}
          {job.applyUrl && (
            <Button asChild>
              <Link href={`/go/job/${job.id}?to=${encodeURIComponent(job.applyUrl)}`}>Apply now</Link>
            </Button>
          )}
          <div className="rounded-lg border border-border/70 p-3 text-xs">
            <p>{views} views in 30 days</p>
            <p>{clicks} apply clicks in 30 days</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
