"use client";

import { Skeleton } from "@heroui/skeleton";

/**
 * Skeleton untuk halaman kelola (search bar + data table)
 */
const TablePageSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Top bar: Search + action button */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Table skeleton */}
      <div className="w-full overflow-hidden rounded-xl border border-default-200">
        {/* Table header */}
        <div className="flex gap-4 border-b border-default-200 bg-default-100 px-4 py-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1 rounded-md" />
          ))}
        </div>

        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center gap-4 border-b border-default-100 px-4 py-4"
          >
            {Array.from({ length: 5 }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 flex-1 rounded-md" />
            ))}
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

export default TablePageSkeleton;
