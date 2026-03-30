import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-72" />
      </div>
      <div className="space-y-0">
        <div className="flex gap-4 border-b border-border pb-2 mb-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-2 border-b border-border/40">
            {Array.from({ length: 6 }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
