import type { Metadata } from "next";

import { CharitySubmissionForm } from "@/components/forms/CharitySubmissionForm";
import PageContainer from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Submit a charity",
};

export default function SubmitCharityPage() {
  return (
    <PageContainer className="py-12">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Submit a charity profile</CardTitle>
            <CardDescription>Help local people discover support and community organisations.</CardDescription>
          </CardHeader>
          <CardContent>
            <CharitySubmissionForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
