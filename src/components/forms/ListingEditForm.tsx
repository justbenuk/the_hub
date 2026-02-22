"use client";

import { useActionState } from "react";

import { createListingEditRequestAction } from "@/app/(main)/actions";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialFormState } from "@/types";

type ListingEditFormProps = {
  business: {
    id: string;
    name: string;
    summary: string;
    description: string;
    category: string;
    phone: string | null;
    email: string | null;
    website: string | null;
    address: string;
    postcode: string;
    area: string;
  };
};

export function ListingEditForm({ business }: ListingEditFormProps) {
  const [state, action] = useActionState(createListingEditRequestAction, initialFormState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="businessId" value={business.id} />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="name" label="Business name" error={state.errors?.name?.[0]}>
          <Input id="name" name="name" defaultValue={business.name} required />
        </FormField>
        <FormField id="category" label="Category" error={state.errors?.category?.[0]}>
          <Input id="category" name="category" defaultValue={business.category} required />
        </FormField>
      </div>

      <FormField id="summary" label="Summary" error={state.errors?.summary?.[0]}>
        <Textarea id="summary" name="summary" className="min-h-20" defaultValue={business.summary} required />
      </FormField>

      <FormField id="description" label="Description" error={state.errors?.description?.[0]}>
        <Textarea id="description" name="description" className="min-h-32" defaultValue={business.description} required />
      </FormField>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="phone" label="Phone" error={state.errors?.phone?.[0]}>
          <Input id="phone" name="phone" defaultValue={business.phone ?? ""} />
        </FormField>
        <FormField id="email" label="Email" error={state.errors?.email?.[0]}>
          <Input id="email" name="email" type="email" defaultValue={business.email ?? ""} />
        </FormField>
      </div>

      <FormField id="website" label="Website" error={state.errors?.website?.[0]}>
        <Input id="website" name="website" defaultValue={business.website ?? ""} placeholder="https://" />
      </FormField>

      <div className="grid gap-4 md:grid-cols-3">
        <FormField id="address" label="Address" error={state.errors?.address?.[0]}>
          <Input id="address" name="address" defaultValue={business.address} required />
        </FormField>
        <FormField id="postcode" label="Postcode" error={state.errors?.postcode?.[0]}>
          <Input id="postcode" name="postcode" defaultValue={business.postcode} required />
        </FormField>
        <FormField id="area" label="Area" error={state.errors?.area?.[0]}>
          <Input id="area" name="area" defaultValue={business.area} required />
        </FormField>
      </div>

      {state.message && (
        <p className={state.success ? "text-sm text-primary" : "text-sm text-destructive"}>{state.message}</p>
      )}

      <SubmitButton label="Submit changes for approval" pendingLabel="Submitting..." />
    </form>
  );
}
