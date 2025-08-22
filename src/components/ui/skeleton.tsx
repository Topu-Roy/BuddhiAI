import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-foreground/20 animate-pulse rounded-md dark:bg-white/10", className)}
      {...props}
    />
  );
}

export { Skeleton };
