import { Building2, CalendarDays, HeartHandshake, Newspaper, SearchCheck, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

import PageContainer from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [businessCount, jobCount, eventCount, newsCount, charityCount, latestEvents, latestJobs] = await Promise.all([
    prisma.business.count(),
    prisma.job.count(),
    prisma.event.count(),
    prisma.newsArticle.count(),
    prisma.charity.count(),
    prisma.event.findMany({ orderBy: { startsAt: "asc" }, take: 3 }),
    prisma.job.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }),
  ]);

  return (
    <div className="pb-20">
      <PageContainer className="pt-16 md:pt-24">
        <div className="animate-rise-in space-y-8">
          <Badge className="rounded-full bg-accent/20 px-4 py-1 text-accent-foreground hover:bg-accent/30">
            Everything local in Tamworth, UK
          </Badge>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-5">
              <h1 className="text-4xl leading-tight font-semibold md:text-6xl">
                The complete Tamworth hub for business, jobs, events, news, and charities.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
                Discover trusted local information in one place and request your business listing in minutes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link href="/businesses">Explore directory</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/request-listing">Request your listing</Link>
                </Button>
              </div>
            </div>

            <Card className="border-primary/20 bg-card/85 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Live local index</CardTitle>
                <CardDescription>One clean front door for Tamworth communities and organisations.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-border/70 p-3">{businessCount} businesses</div>
                <div className="rounded-lg border border-border/70 p-3">{jobCount} jobs</div>
                <div className="rounded-lg border border-border/70 p-3">{eventCount} events</div>
                <div className="rounded-lg border border-border/70 p-3">{newsCount} news posts</div>
                <div className="col-span-2 rounded-lg border border-border/70 p-3">{charityCount} charities</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>

      <PageContainer className="mt-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <HubLinkCard href="/businesses" icon={Building2} title="Local business directory" copy="Browse companies, services, and shopfronts across Tamworth." />
          <HubLinkCard href="/jobs" icon={BriefcaseBusiness} title="Job search" copy="Find local vacancies and career opportunities nearby." />
          <HubLinkCard href="/events" icon={CalendarDays} title="Events and dates" copy="See what is happening this week across the town." />
          <HubLinkCard href="/news" icon={Newspaper} title="Area news" copy="Read useful local updates that matter to residents." />
          <HubLinkCard href="/charities" icon={HeartHandshake} title="Charities and support" copy="Discover local charities and community organisations." />
          <HubLinkCard href="/request-listing" icon={SearchCheck} title="Request listing" copy="Apply to get your business added to the official directory." />
        </div>
      </PageContainer>

      <PageContainer className="mt-16 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Upcoming events</CardTitle>
            <CardDescription>Latest dates from venues and groups around Tamworth.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events listed yet.</p>
            ) : (
              latestEvents.map((event) => (
                <div key={event.id} className="rounded-lg border border-border/70 p-3">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.venue} - {event.startsAt.toLocaleDateString("en-GB")}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Latest jobs</CardTitle>
            <CardDescription>Fresh opportunities posted by local employers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No jobs listed yet.</p>
            ) : (
              latestJobs.map((job) => (
                <div key={job.id} className="rounded-lg border border-border/70 p-3">
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {job.company} - {job.location}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
}

type HubLinkCardProps = {
  href: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  copy: string;
};

function HubLinkCard({ href, icon: Icon, title, copy }: HubLinkCardProps) {
  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Icon className="size-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{copy}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" asChild>
          <Link href={href}>Open</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
