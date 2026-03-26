"use client";

import { Skeleton } from "@heroui/skeleton";

const CardMapSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Top bar: Search + action button */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-default-200 p-4"
          >
            {/* Card image */}
            <Skeleton className="h-40 w-full rounded-lg" />

            {/* Card title */}
            <Skeleton className="h-4 w-3/4 rounded-md" />

            {/* Card subtitle */}
            <Skeleton className="h-3 w-1/2 rounded-md" />

            {/* Card description lines */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-5/6 rounded-md" />
            </div>

            {/* Card footer: badge + action buttons */}
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-6 w-16 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-center gap-2 py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-md" />
        ))}
      </div>
    </div>
  );
};

export default CardMapSkeleton;
