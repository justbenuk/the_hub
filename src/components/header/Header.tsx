import Link from "next/link";
import SiteMenu from "../menus/SiteMenu";
import PageContainer from "../shared/PageContainer";

export default function Header() {
  return (
    <header className="bg-primary text-white">
      <PageContainer>
        <div className="flex flex-row items-center justify-between py-4">
          <Link href={"/"}>
            <h1 className="font-semibold text-xl">The Hub</h1>
          </Link>
          <SiteMenu />
          <div>poss menu</div>
        </div>
      </PageContainer>
    </header>
  );
}
