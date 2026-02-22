"use client";

import { useActionState } from "react";

import { createNewsSubmissionAction } from "@/app/(main)/actions";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialFormState } from "@/types";

export function NewsSubmissionForm() {
  const [state, action] = useActionState(createNewsSubmissionAction, initialFormState);

  return (
    <form action={action} className="space-y-4">
      <FormField id="title" label="Headline" error={state.errors?.title?.[0]}>
        <Input id="title" name="title" required />
      </FormField>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="source" label="Source" error={state.errors?.source?.[0]}>
          <Input id="source" name="source" required />
        </FormField>
        <FormField id="area" label="Area" error={state.errors?.area?.[0]}>
          <Input id="area" name="area" required />
        </FormField>
      </div>
      <FormField id="sourceUrl" label="Source URL" error={state.errors?.sourceUrl?.[0]}>
        <Input id="sourceUrl" name="sourceUrl" placeholder="https://" />
      </FormField>
      <FormField id="summary" label="Summary" error={state.errors?.summary?.[0]}>
        <Textarea id="summary" name="summary" className="min-h-20" required />
      </FormField>
      <FormField id="body" label="Full story" error={state.errors?.body?.[0]}>
        <Textarea id="body" name="body" className="min-h-32" required />
      </FormField>
      <FormField id="contactEmail" label="Contact email" error={state.errors?.contactEmail?.[0]}>
        <Input id="contactEmail" name="contactEmail" type="email" required />
      </FormField>
      {state.message && (
        <p className={state.success ? "text-sm text-primary" : "text-sm text-destructive"}>{state.message}</p>
      )}
      <SubmitButton label="Submit news" pendingLabel="Submitting..." />
    </form>
  );
}
