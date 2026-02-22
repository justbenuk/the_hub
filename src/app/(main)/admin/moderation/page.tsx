import type { Metadata } from "next";

import {
  approveBusinessRequestAction,
  approveBusinessEditRequestAction,
  approveBusinessClaimRequestAction,
  approveCharitySubmissionAction,
  approveEventSubmissionAction,
  approveJobSubmissionAction,
  approveNewsSubmissionAction,
  rejectBusinessRequestAction,
  rejectBusinessEditRequestAction,
  rejectBusinessClaimRequestAction,
  rejectCharitySubmissionAction,
  rejectEventSubmissionAction,
  rejectJobSubmissionAction,
  rejectNewsSubmissionAction,
} from "@/app/(main)/actions";
import PageContainer from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Moderation",
};

export default async function ModerationPage() {
  await requireAdminSession();

  const [businessRequests, businessEditRequests, businessClaimRequests, jobSubmissions, eventSubmissions, newsSubmissions, charitySubmissions] =
    await Promise.all([
      prisma.businessListingRequest.findMany({ where: { status: "Pending" }, orderBy: { createdAt: "desc" }, take: 30 }),
      prisma.businessEditRequest.findMany({
        where: { status: "Pending" },
        orderBy: { createdAt: "desc" },
        take: 30,
        include: { business: { select: { name: true } }, owner: { select: { email: true } } },
      }),
      prisma.businessClaimRequest.findMany({
        where: { status: "Pending" },
        orderBy: { createdAt: "desc" },
        take: 30,
        include: { business: { select: { name: true } }, user: { select: { email: true, name: true } } },
      }),
      prisma.jobSubmission.findMany({ where: { status: "Pending" }, orderBy: { createdAt: "desc" }, take: 30 }),
      prisma.eventSubmission.findMany({ where: { status: "Pending" }, orderBy: { createdAt: "desc" }, take: 30 }),
      prisma.newsSubmission.findMany({ where: { status: "Pending" }, orderBy: { createdAt: "desc" }, take: 30 }),
      prisma.charitySubmission.findMany({ where: { status: "Pending" }, orderBy: { createdAt: "desc" }, take: 30 }),
    ]);

  return (
    <PageContainer className="py-12 space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">Moderation queue</h1>
        <p className="text-muted-foreground">Approve or reject incoming listings and submissions.</p>
      </div>

      <ModerationSection
        title="Business listing requests"
        count={businessRequests.length}
        empty="No pending business listing requests."
        items={businessRequests.map((request) => ({
          id: request.id,
          title: request.businessName,
          subtitle: `${request.category} - ${request.area}`,
          detail: `${request.contactName} (${request.contactEmail})`,
        }))}
        approveAction={approveBusinessRequestAction}
        rejectAction={rejectBusinessRequestAction}
        fieldName="requestId"
      />

      <ModerationSection
        title="Business edit requests"
        count={businessEditRequests.length}
        empty="No pending business edit requests."
        items={businessEditRequests.map((request) => ({
          id: request.id,
          title: request.name,
          subtitle: `Current listing: ${request.business.name}`,
          detail: request.owner.email,
        }))}
        approveAction={approveBusinessEditRequestAction}
        rejectAction={rejectBusinessEditRequestAction}
        fieldName="requestId"
      />

      <ModerationSection
        title="Business claim requests"
        count={businessClaimRequests.length}
        empty="No pending business claim requests."
        items={businessClaimRequests.map((request) => ({
          id: request.id,
          title: request.business.name,
          subtitle: `Claim by ${request.user.name}`,
          detail: request.user.email,
        }))}
        approveAction={approveBusinessClaimRequestAction}
        rejectAction={rejectBusinessClaimRequestAction}
        fieldName="requestId"
      />

      <ModerationSection
        title="Job submissions"
        count={jobSubmissions.length}
        empty="No pending job submissions."
        items={jobSubmissions.map((submission) => ({
          id: submission.id,
          title: submission.title,
          subtitle: `${submission.company} - ${submission.location}`,
          detail: submission.contactEmail,
        }))}
        approveAction={approveJobSubmissionAction}
        rejectAction={rejectJobSubmissionAction}
      />

      <ModerationSection
        title="Event submissions"
        count={eventSubmissions.length}
        empty="No pending event submissions."
        items={eventSubmissions.map((submission) => ({
          id: submission.id,
          title: submission.title,
          subtitle: `${submission.venue} - ${submission.area}`,
          detail: submission.contactEmail,
        }))}
        approveAction={approveEventSubmissionAction}
        rejectAction={rejectEventSubmissionAction}
      />

      <ModerationSection
        title="News submissions"
        count={newsSubmissions.length}
        empty="No pending news submissions."
        items={newsSubmissions.map((submission) => ({
          id: submission.id,
          title: submission.title,
          subtitle: `${submission.source} - ${submission.area}`,
          detail: submission.contactEmail,
        }))}
        approveAction={approveNewsSubmissionAction}
        rejectAction={rejectNewsSubmissionAction}
      />

      <ModerationSection
        title="Charity submissions"
        count={charitySubmissions.length}
        empty="No pending charity submissions."
        items={charitySubmissions.map((submission) => ({
          id: submission.id,
          title: submission.name,
          subtitle: submission.area,
          detail: submission.contactEmail,
        }))}
        approveAction={approveCharitySubmissionAction}
        rejectAction={rejectCharitySubmissionAction}
      />
    </PageContainer>
  );
}

type ModerationItem = {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
};

type ModerationSectionProps = {
  title: string;
  count: number;
  empty: string;
  items: ModerationItem[];
  approveAction: (formData: FormData) => Promise<void>;
  rejectAction: (formData: FormData) => Promise<void>;
  fieldName?: string;
};

function ModerationSection({
  title,
  count,
  empty,
  items,
  approveAction,
  rejectAction,
  fieldName = "submissionId",
}: ModerationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>
          <Badge variant="secondary">{count} pending</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-lg border border-border/70 p-3">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
              <div className="mt-3 flex items-center gap-2">
                <form action={approveAction}>
                  <input type="hidden" name={fieldName} value={item.id} />
                  <Button size="sm" type="submit">
                    Approve
                  </Button>
                </form>
                <form action={rejectAction}>
                  <input type="hidden" name={fieldName} value={item.id} />
                  <Button size="sm" variant="outline" type="submit">
                    Reject
                  </Button>
                </form>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
