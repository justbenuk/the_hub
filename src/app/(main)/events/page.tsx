import type { Metadata } from "next";
import Link from "next/link";

import PageContainer from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Events",
};

type SearchParams = Promise<{ q?: string; area?: string; month?: string }>;

export default async function EventsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const area = params.area?.trim() ?? "";
  const month = params.month?.trim() ?? "";

  const monthDate = month ? new Date(`${month}-01T00:00:00`) : null;
  const monthEnd = monthDate ? new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1) : null;

  const events = await prisma.event.findMany({
    where: {
      ...(q
        ? { OR: [{ title: { contains: q } }, { summary: { contains: q } }, { venue: { contains: q } }] }
        : {}),
      ...(area ? { area: { contains: area } } : {}),
      ...(monthDate && monthEnd ? { startsAt: { gte: monthDate, lt: monthEnd } } : {}),
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
    orderBy: { startsAt: "asc" },
  });

  const scoredEvents = events
    .map((event) => {
      const tier = event.business?.owner?.subscriptionTier ?? "Free";
      const featured = event.manuallyFeatured || tier !== "Free";
      return { ...event, tier, featured };
    })
    .sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      const score = (tier: "Free" | "Growth" | "TownPartner") =>
        tier === "TownPartner" ? 2 : tier === "Growth" ? 1 : 0;
      return score(b.tier) - score(a.tier) || a.startsAt.getTime() - b.startsAt.getTime();
    });

  return (
    <PageContainer className="py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">Events and dates</h1>
          <p className="text-muted-foreground">Markets, festivals, workshops, and local meetups.</p>
        </div>
        <Button asChild>
          <Link href="/submit-event">Submit an event</Link>
        </Button>
      </div>

      <form className="mb-6 grid gap-3 rounded-xl border border-border/70 bg-card/60 p-4 md:grid-cols-[2fr_1fr_1fr_auto]">
        <Input name="q" placeholder="Search event or venue" defaultValue={q} />
        <Input name="area" placeholder="Area" defaultValue={area} />
        <Input name="month" type="month" defaultValue={month} />
        <div className="flex items-center gap-2">
          <Button type="submit">Filter</Button>
          <Button variant="outline" asChild>
            <Link href="/events">Reset</Link>
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {scoredEvents.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge variant="secondary">{event.area}</Badge>
                {event.price && <Badge variant="outline">{event.price}</Badge>}
                {event.featured && (
                  <Badge>{event.manuallyFeatured ? "Featured by admin" : event.tier === "TownPartner" ? "Partner featured" : "Featured"}</Badge>
                )}
              </div>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>
                {event.venue} - {event.startsAt.toLocaleDateString("en-GB")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{event.summary}</p>
              <Button variant="outline" asChild>
                <Link href={`/events/${event.id}`}>View details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
