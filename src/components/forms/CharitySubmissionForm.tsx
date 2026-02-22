"use client";

import { useActionState } from "react";

import { createCharitySubmissionAction } from "@/app/(main)/actions";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialFormState } from "@/types";

export function CharitySubmissionForm() {
  const [state, action] = useActionState(createCharitySubmissionAction, initialFormState);

  return (
    <form action={action} className="space-y-4">
      <FormField id="name" label="Charity name" error={state.errors?.name?.[0]}>
        <Input id="name" name="name" required />
      </FormField>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="area" label="Area" error={state.errors?.area?.[0]}>
          <Input id="area" name="area" required />
        </FormField>
        <FormField id="website" label="Website" error={state.errors?.website?.[0]}>
          <Input id="website" name="website" placeholder="https://" />
        </FormField>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="email" label="Public email" error={state.errors?.email?.[0]}>
          <Input id="email" name="email" type="email" placeholder="Optional" />
        </FormField>
        <FormField id="phone" label="Public phone" error={state.errors?.phone?.[0]}>
          <Input id="phone" name="phone" placeholder="Optional" />
        </FormField>
      </div>
      <FormField id="summary" label="Summary" error={state.errors?.summary?.[0]}>
        <Textarea id="summary" name="summary" className="min-h-20" required />
      </FormField>
      <FormField id="mission" label="Mission" error={state.errors?.mission?.[0]}>
        <Textarea id="mission" name="mission" className="min-h-28" required />
      </FormField>
      <FormField id="contactEmail" label="Contact email" error={state.errors?.contactEmail?.[0]}>
        <Input id="contactEmail" name="contactEmail" type="email" required />
      </FormField>
      {state.message && (
        <p className={state.success ? "text-sm text-primary" : "text-sm text-destructive"}>{state.message}</p>
      )}
      <SubmitButton label="Submit charity" pendingLabel="Submitting..." />
    </form>
  );
}
