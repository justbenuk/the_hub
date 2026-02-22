import type { Metadata } from "next";

import { EventSubmissionForm } from "@/components/forms/EventSubmissionForm";
import PageContainer from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Submit an event",
};

export default function SubmitEventPage() {
  return (
    <PageContainer className="py-12">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Submit an event</CardTitle>
            <CardDescription>Share local dates and activities with the Tamworth community.</CardDescription>
          </CardHeader>
          <CardContent>
            <EventSubmissionForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
