import Link from "next/link";

export default function SiteMenu() {
  return (
    <nav className="flex flex-row items-center gap-8">
      <Link href={"/"}>Business</Link>
      <Link href={"/"}>Jobs</Link>
      <Link href={"/"}>Events</Link>
      <Link href={"/"}>Charities</Link>
      <Link href={"/"}>Community</Link>
    </nav>
  );
}
