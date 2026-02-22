"use client";

import { useActionState } from "react";

import { createJobSubmissionAction } from "@/app/(main)/actions";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialFormState } from "@/types";

export function JobSubmissionForm() {
  const [state, action] = useActionState(createJobSubmissionAction, initialFormState);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="title" label="Job title" error={state.errors?.title?.[0]}>
          <Input id="title" name="title" required />
        </FormField>
        <FormField id="company" label="Company" error={state.errors?.company?.[0]}>
          <Input id="company" name="company" required />
        </FormField>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="type" label="Job type" error={state.errors?.type?.[0]}>
          <Input id="type" name="type" placeholder="Full-time, part-time, contract" required />
        </FormField>
        <FormField id="location" label="Location" error={state.errors?.location?.[0]}>
          <Input id="location" name="location" required />
        </FormField>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="salary" label="Salary" error={state.errors?.salary?.[0]}>
          <Input id="salary" name="salary" placeholder="Optional" />
        </FormField>
        <FormField id="applyUrl" label="Apply URL" error={state.errors?.applyUrl?.[0]}>
          <Input id="applyUrl" name="applyUrl" placeholder="https://" />
        </FormField>
      </div>
      <FormField id="summary" label="Role summary" error={state.errors?.summary?.[0]}>
        <Textarea id="summary" name="summary" className="min-h-24" required />
      </FormField>
      <FormField id="contactEmail" label="Contact email" error={state.errors?.contactEmail?.[0]}>
        <Input id="contactEmail" name="contactEmail" type="email" required />
      </FormField>
      {state.message && (
        <p className={state.success ? "text-sm text-primary" : "text-sm text-destructive"}>{state.message}</p>
      )}
      <SubmitButton label="Submit job" pendingLabel="Submitting..." />
    </form>
  );
}
