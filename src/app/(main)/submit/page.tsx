import type { Metadata } from "next";
import Link from "next/link";

import PageContainer from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Submit content",
};

export default function SubmitPage() {
  return (
    <PageContainer className="py-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold">Submit to Tamworth Hub</h1>
        <p className="text-muted-foreground">Share jobs, events, charity profiles, and local news. Everything is moderated first.</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <SubmitCard title="Submit a job" copy="Post local opportunities for residents and job seekers." href="/submit-job" />
        <SubmitCard title="Submit an event" copy="Share event dates for markets, workshops, and community activities." href="/submit-event" />
        <SubmitCard title="Submit local news" copy="Contribute relevant and sourced updates for Tamworth." href="/submit-news" />
        <SubmitCard title="Submit a charity" copy="Help people discover local services and support groups." href="/submit-charity" />
      </div>
    </PageContainer>
  );
}

function SubmitCard({ title, copy, href }: { title: string; copy: string; href: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{copy}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" asChild>
          <Link href={href}>Open form</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
