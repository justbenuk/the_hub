import Link from "next/link";
import { Compass, MapPin } from "lucide-react";

import { signOutAction } from "@/app/(main)/actions";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/auth";

import SiteMenu from "../menus/SiteMenu";
import PageContainer from "../shared/PageContainer";

export default async function Header() {
  const session = await getCurrentSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <PageContainer>
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Compass className="size-4" />
            </span>
            <span className="font-semibold tracking-tight">Tamworth Hub</span>
            <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
              <MapPin className="size-3" />
              Staffordshire
            </span>
          </Link>

          <SiteMenu />

          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">{session.user.name.split(" ")[0]}</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/my-listings">My listings</Link>
                </Button>
                {session.user.role === "Admin" && (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/admin/moderation">Moderation</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/admin/analytics">Analytics</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/admin/featured">Featured</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/admin/clients">Clients</Link>
                    </Button>
                  </>
                )}
                <form action={signOutAction}>
                  <Button variant="outline" type="submit">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </PageContainer>
    </header>
  );
}
