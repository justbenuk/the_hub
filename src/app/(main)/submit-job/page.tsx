import type { Metadata } from "next";

import { JobSubmissionForm } from "@/components/forms/JobSubmissionForm";
import PageContainer from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Submit a job",
};

export default function SubmitJobPage() {
  return (
    <PageContainer className="py-12">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Submit a job listing</CardTitle>
            <CardDescription>All submissions are reviewed before publication.</CardDescription>
          </CardHeader>
          <CardContent>
            <JobSubmissionForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
