import DashboardPageSkeleton from "@/components/ui/Skeletons/DashboardPageSkeleton";

export default function Loading() {
  return <DashboardPageSkeleton />; // auto wrap page.tsx use suspense and this skeleton when loading data
}
