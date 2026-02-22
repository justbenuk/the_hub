import type { Metadata } from "next";

import { setEventFeaturedAction, setJobFeaturedAction } from "@/app/(main)/actions";
import PageContainer from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Featured Controls",
};

export default async function AdminFeaturedPage() {
  await requireAdminSession();

  const [jobs, events] = await Promise.all([
    prisma.job.findMany({
      orderBy: { publishedAt: "desc" },
      take: 30,
      include: { business: { include: { owner: { select: { subscriptionTier: true } } } } },
    }),
    prisma.event.findMany({
      orderBy: { startsAt: "asc" },
      take: 30,
      include: { business: { include: { owner: { select: { subscriptionTier: true } } } } },
    }),
  ]);

  return (
    <PageContainer className="py-12 space-y-6">
      <div>
        <h1 className="text-4xl font-semibold">Featured controls</h1>
        <p className="text-muted-foreground">Manually feature specific jobs or events for campaigns and sponsors.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
          <CardDescription>Manual feature override for job posts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {jobs.map((job) => (
            <div key={job.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg border border-border/70 p-3">
              <div>
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-muted-foreground">
                  {job.company} - plan {job.business?.owner?.subscriptionTier ?? "Free"}
                </p>
              </div>
              {job.manuallyFeatured ? <Badge>Manual featured</Badge> : <Badge variant="outline">Standard</Badge>}
              <form action={setJobFeaturedAction}>
                <input type="hidden" name="jobId" value={job.id} />
                <input type="hidden" name="value" value={job.manuallyFeatured ? "false" : "true"} />
                <Button size="sm" type="submit" variant={job.manuallyFeatured ? "outline" : "default"}>
                  {job.manuallyFeatured ? "Remove feature" : "Feature"}
                </Button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>Manual feature override for event posts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {events.map((event) => (
            <div key={event.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg border border-border/70 p-3">
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {event.venue} - plan {event.business?.owner?.subscriptionTier ?? "Free"}
                </p>
              </div>
              {event.manuallyFeatured ? <Badge>Manual featured</Badge> : <Badge variant="outline">Standard</Badge>}
              <form action={setEventFeaturedAction}>
                <input type="hidden" name="eventId" value={event.id} />
                <input type="hidden" name="value" value={event.manuallyFeatured ? "false" : "true"} />
                <Button size="sm" type="submit" variant={event.manuallyFeatured ? "outline" : "default"}>
                  {event.manuallyFeatured ? "Remove feature" : "Feature"}
                </Button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
