import { cn } from "@/lib/utils";

/** The page's one measure: 1240px of content inside a generous gutter. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
