/* eslint-disable react-hooks/purity */

import Link from "next/link";
import { notFound } from "next/navigation";

import PageContainer from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ eventId: string }>;

export default async function EventDetailPage({ params }: { params: Params }) {
  const { eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      business: {
        include: {
          owner: { select: { subscriptionTier: true } },
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  await prisma.eventInteraction.create({ data: { eventId: event.id, type: "View" } });

  const interactions = await prisma.eventInteraction.findMany({
    where: { eventId: event.id, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
  });
  const views = interactions.filter((item) => item.type === "View").length;
  const clicks = interactions.filter((item) => item.type === "Click").length;

  const tier = event.business?.owner?.subscriptionTier ?? "Free";
  const featured = event.manuallyFeatured || tier !== "Free";

  return (
    <PageContainer className="py-12">
      <Card>
        <CardHeader>
          <div className="mb-2 flex gap-2">
            <Badge variant="secondary">{event.area}</Badge>
            {event.price && <Badge variant="outline">{event.price}</Badge>}
            {featured && <Badge>{event.manuallyFeatured ? "Featured by admin" : tier === "TownPartner" ? "Partner featured" : "Featured"}</Badge>}
          </div>
          <CardTitle className="text-3xl">{event.title}</CardTitle>
          <CardDescription>
            {event.venue} - {event.startsAt.toLocaleDateString("en-GB")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>{event.summary}</p>
          {event.bookingUrl && (
            <Button asChild>
              <Link href={`/go/event/${event.id}?to=${encodeURIComponent(event.bookingUrl)}`}>Book or learn more</Link>
            </Button>
          )}
          <div className="rounded-lg border border-border/70 p-3 text-xs">
            <p>{views} views in 30 days</p>
            <p>{clicks} booking clicks in 30 days</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
