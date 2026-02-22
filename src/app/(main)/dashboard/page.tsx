import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import PageContainer from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const [
    requestCount,
    jobSubmissionCount,
    eventSubmissionCount,
    newsSubmissionCount,
    charitySubmissionCount,
    pendingRequests,
    businessCount,
    jobCount,
    eventCount,
    newsCount,
    charityCount,
  ] =
    await Promise.all([
      prisma.businessListingRequest.count(),
      prisma.jobSubmission.count({ where: { status: "Pending" } }),
      prisma.eventSubmission.count({ where: { status: "Pending" } }),
      prisma.newsSubmission.count({ where: { status: "Pending" } }),
      prisma.charitySubmission.count({ where: { status: "Pending" } }),
      prisma.businessListingRequest.findMany({
        where: { status: "Pending" },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.business.count(),
      prisma.job.count(),
      prisma.event.count(),
      prisma.newsArticle.count(),
      prisma.charity.count(),
    ]);

  return (
    <PageContainer className="py-12">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Hub overview</CardTitle>
            <CardDescription>
              Signed in as <span className="font-medium text-foreground">{session.user.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Stat label="Directory businesses" value={businessCount} />
            <Stat label="Open jobs" value={jobCount} />
            <Stat label="Upcoming events" value={eventCount} />
            <Stat label="News stories" value={newsCount} />
            <Stat label="Charities listed" value={charityCount} />
            <Stat label="Listing requests" value={requestCount + jobSubmissionCount + eventSubmissionCount + newsSubmissionCount + charitySubmissionCount} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Recent pending requests</CardTitle>
            <CardDescription>New businesses asking to be added to the directory.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending requests right now.</p>
            ) : (
              pendingRequests.map((request) => (
                <div key={request.id} className="rounded-lg border border-border/70 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="font-medium">{request.businessName}</p>
                    <Badge variant="secondary">{request.category}</Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {request.area} - {request.contactName} ({request.contactEmail})
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-2xl">Submission flow</CardTitle>
          <CardDescription>Encourage local organisations to contribute, then moderate for quality.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/submit">Submission hub</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/my-listings">My listings</Link>
          </Button>
          {session.user.role === "Admin" && (
            <Button asChild>
              <Link href="/admin/moderation">Open moderation</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/70 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-semibold">{value}</p>
    </div>
  );
}
