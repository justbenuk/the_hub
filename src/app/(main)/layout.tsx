import Header from "@/components/header/Header";
import PageContainer from "@/components/shared/PageContainer";
import { RootProps } from "@/types";

export default function MainLayout({ children }: RootProps) {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 py-8 text-sm text-muted-foreground">
        <PageContainer className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p>Built for local life in Tamworth.</p>
          <p>Simple tools for people, places, and progress.</p>
        </PageContainer>
      </footer>
    </div>
  );
}
