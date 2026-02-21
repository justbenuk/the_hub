import { cn } from "@/lib/utils";
import { RootProps } from "@/types";

export default function PageContainer({ children, className }: RootProps) {
  return (
    <div className={cn("container mx-auto px-6 2xl:px-0")}>{children}</div>
  );
}
