"use client";

import { Skeleton } from "@heroui/skeleton";

const DashboardSidebarSkeleton = () => {
  return (
    <div className="fixed z-50 flex h-screen w-full max-w-[300px] -translate-x-full flex-col justify-between border-r-1 border-default-200 bg-white px-4 py-6 lg:relative lg:translate-x-0">
      {/* Logo & Menu Items */}
      <div className="flex flex-col items-center justify-center">
        {/* Logo skeleton */}
        <Skeleton className="mb-5 h-[50px] w-[150px] rounded-lg" />

        {/* Menu items skeleton */}
        <div className="flex w-full flex-col gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Logout button skeleton */}
      <div className="p-1">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default DashboardSidebarSkeleton;
