import type { Metadata } from "next";

import { SignInForm } from "@/components/forms/SignInForm";
import PageContainer from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <PageContainer className="py-16">
      <div className="mx-auto max-w-md animate-rise-in">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Welcome back</CardTitle>
            <CardDescription>Sign in to manage your updates and keep Tamworth informed.</CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
