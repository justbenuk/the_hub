import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
