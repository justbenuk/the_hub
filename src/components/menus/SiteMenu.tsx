import Link from "next/link";

export default function SiteMenu() {
  return (
    <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
      <Link href="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      <Link href="/businesses" className="hover:text-foreground transition-colors">
        Businesses
      </Link>
      <Link href="/jobs" className="hover:text-foreground transition-colors">
        Jobs
      </Link>
      <Link href="/events" className="hover:text-foreground transition-colors">
        Events
      </Link>
      <Link href="/news" className="hover:text-foreground transition-colors">
        News
      </Link>
      <Link href="/charities" className="hover:text-foreground transition-colors">
        Charities
      </Link>
      <Link href="/submit" className="hover:text-foreground transition-colors">
        Submit
      </Link>
      <Link href="/for-business" className="hover:text-foreground transition-colors">
        For business
      </Link>
      <Link href="/request-listing" className="hover:text-foreground transition-colors">
        Request listing
      </Link>
    </nav>
  );
}
