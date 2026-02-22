import type { Metadata } from "next";

import PageContainer from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AdminAnalyticsPage() {
  await requireAdminSession();

  const now = new Date();
  const cutoff30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const cutoff14d = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [businesses, interactions, jobs, jobInteractions, events, eventInteractions, planInterests] = await Promise.all([
    prisma.business.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.businessInteraction.findMany({ where: { createdAt: { gte: cutoff30d } } }),
    prisma.job.findMany({
      select: {
        id: true,
        title: true,
        manuallyFeatured: true,
        business: { select: { owner: { select: { subscriptionTier: true } } } },
      },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.jobInteraction.findMany({ where: { createdAt: { gte: cutoff30d } } }),
    prisma.event.findMany({
      select: {
        id: true,
        title: true,
        manuallyFeatured: true,
        business: { select: { owner: { select: { subscriptionTier: true } } } },
      },
      orderBy: { startsAt: "asc" },
    }),
    prisma.eventInteraction.findMany({ where: { createdAt: { gte: cutoff30d } } }),
    prisma.planInterest.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  const byBusiness = new Map<string, { views: number; clicks: number }>();
  for (const item of interactions) {
    const existing = byBusiness.get(item.businessId) ?? { views: 0, clicks: 0 };
    if (item.type === "View") {
      existing.views += 1;
    } else {
      existing.clicks += 1;
    }
    byBusiness.set(item.businessId, existing);
  }

  const rows = businesses
    .map((business) => {
      const metrics = byBusiness.get(business.id) ?? { views: 0, clicks: 0 };
      const ctr = metrics.views > 0 ? Math.round((metrics.clicks / metrics.views) * 100) : 0;
      return { ...business, ...metrics, ctr };
    })
    .sort((a, b) => b.clicks - a.clicks || b.views - a.views)
    .slice(0, 20);

  const byJob = new Map<string, { views: number; clicks: number }>();
  for (const item of jobInteractions) {
    const existing = byJob.get(item.jobId) ?? { views: 0, clicks: 0 };
    if (item.type === "View") existing.views += 1;
    else existing.clicks += 1;
    byJob.set(item.jobId, existing);
  }

  const byEvent = new Map<string, { views: number; clicks: number }>();
  for (const item of eventInteractions) {
    const existing = byEvent.get(item.eventId) ?? { views: 0, clicks: 0 };
    if (item.type === "View") existing.views += 1;
    else existing.clicks += 1;
    byEvent.set(item.eventId, existing);
  }

  const tierScore = (tier: "Free" | "Growth" | "TownPartner") =>
    tier === "TownPartner" ? 2 : tier === "Growth" ? 1 : 0;

  const jobRows = jobs
    .map((job) => {
      const tier = job.business?.owner?.subscriptionTier ?? "Free";
      const metrics = byJob.get(job.id) ?? { views: 0, clicks: 0 };
      return { ...job, tier, ...metrics, featured: job.manuallyFeatured || tier !== "Free" };
    })
    .sort((a, b) => tierScore(b.tier) - tierScore(a.tier) || b.clicks - a.clicks)
    .slice(0, 10);

  const eventRows = events
    .map((event) => {
      const tier = event.business?.owner?.subscriptionTier ?? "Free";
      const metrics = byEvent.get(event.id) ?? { views: 0, clicks: 0 };
      return { ...event, tier, ...metrics, featured: event.manuallyFeatured || tier !== "Free" };
    })
    .sort((a, b) => tierScore(b.tier) - tierScore(a.tier) || b.clicks - a.clicks)
    .slice(0, 10);

  const trendMap = new Map<string, { label: string; views: number; clicks: number }>();
  for (let i = 13; i >= 0; i -= 1) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = date.toISOString().slice(0, 10);
    trendMap.set(key, {
      label: date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }),
      views: 0,
      clicks: 0,
    });
  }

  for (const item of interactions) {
    if (item.createdAt < cutoff14d) continue;
    const key = item.createdAt.toISOString().slice(0, 10);
    const bucket = trendMap.get(key);
    if (!bucket) continue;
    if (item.type === "View") {
      bucket.views += 1;
    } else {
      bucket.clicks += 1;
    }
  }

  const trend = Array.from(trendMap.values());
  const maxTrendValue = Math.max(1, ...trend.map((item) => Math.max(item.views, item.clicks)));

  return (
    <PageContainer className="py-12">
      <div className="mb-6 space-y-2">
        <h1 className="text-4xl font-semibold">Business analytics</h1>
        <p className="text-muted-foreground">Performance for directory profiles over the last 30 days.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>14-day trend</CardTitle>
          <CardDescription>Daily profile views and outbound clicks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-2">
            {trend.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <div className="flex h-28 items-end gap-1">
                  <div className="w-2 rounded-sm bg-primary/70" style={{ height: `${(item.views / maxTrendValue) * 100}%` }} />
                  <div className="w-2 rounded-sm bg-accent/80" style={{ height: `${(item.clicks / maxTrendValue) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
            <span>Primary: views</span>
            <span>Accent: clicks</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Top profiles</CardTitle>
          <CardDescription>Track listings with strongest traffic and click-through rate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No interaction data yet.</p>
          ) : (
            rows.map((row) => (
              <div key={row.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-lg border border-border/70 p-3">
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-muted-foreground">{row.views} views</p>
                <p className="text-sm text-muted-foreground">{row.clicks} clicks</p>
                <p className="text-sm text-muted-foreground">{row.ctr}% CTR</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Featured jobs</CardTitle>
          <CardDescription>Shows which job posts are featured by paid plans.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {jobRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No job data yet.</p>
          ) : (
            jobRows.map((row) => (
              <div key={row.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 rounded-lg border border-border/70 p-3">
                <p className="font-medium">{row.title}</p>
                <p className="text-sm text-muted-foreground">{row.featured ? "Featured" : "Standard"}</p>
                <p className="text-sm text-muted-foreground">{row.tier === "Free" ? "Standard" : row.tier}</p>
                <p className="text-sm text-muted-foreground">{row.views} views</p>
                <p className="text-sm text-muted-foreground">{row.clicks} clicks</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Featured events</CardTitle>
          <CardDescription>Shows which events are featured by paid plans.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {eventRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No event data yet.</p>
          ) : (
            eventRows.map((row) => (
              <div key={row.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 rounded-lg border border-border/70 p-3">
                <p className="font-medium">{row.title}</p>
                <p className="text-sm text-muted-foreground">{row.featured ? "Featured" : "Standard"}</p>
                <p className="text-sm text-muted-foreground">{row.tier === "Free" ? "Standard" : row.tier}</p>
                <p className="text-sm text-muted-foreground">{row.views} views</p>
                <p className="text-sm text-muted-foreground">{row.clicks} clicks</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Revenue enquiries</CardTitle>
          <CardDescription>Recent commercial plan interest submissions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {planInterests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No plan enquiries yet.</p>
          ) : (
            planInterests.map((lead) => (
              <div key={lead.id} className="rounded-lg border border-border/70 p-3">
                <p className="font-medium">{lead.company}</p>
                <p className="text-sm text-muted-foreground">
                  {lead.plan} - {lead.contactName} ({lead.contactEmail})
                </p>
                {lead.notes && <p className="text-xs text-muted-foreground">{lead.notes}</p>}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
