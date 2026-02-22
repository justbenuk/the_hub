import { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type PageContainerProps = ComponentProps<"div">;

export default function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div className={cn("container mx-auto px-6 2xl:px-0", className)} {...props}>
      {children}
    </div>
  );
}
