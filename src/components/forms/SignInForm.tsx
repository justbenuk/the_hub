"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInAction } from "@/app/(main)/actions";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialFormState } from "@/types";

export function SignInForm() {
  const [state, action] = useActionState(signInAction, initialFormState);

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@tamworth.co.uk" required />
        {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
        {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
      </div>

      {state.message && !state.success && <p className="text-sm text-destructive">{state.message}</p>}

      <SubmitButton label="Sign in" pendingLabel="Signing in..." className="w-full" />

      <p className="text-center text-sm text-muted-foreground">
        New to The Hub?{" "}
        <Link href="/signup" className="text-primary underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </form>
  );
}
