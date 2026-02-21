import Header from "@/components/header/Header";
import { RootProps } from "@/types";

export default function MainLayout({ children }: RootProps) {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <footer>footer</footer>
    </div>
  );
}
