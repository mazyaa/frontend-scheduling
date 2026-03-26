"use client";

import { ReactNode, Suspense, useState } from "react";
import { useSession } from "next-auth/react";

import DashboardLayoutSidebar from "./DashboardLayoutSidebar/DashboardLayoutSidebar";

import { DashboardSidebarSkeleton } from "@/components/ui/Skeletons";
import { Greeting } from "@/components/ui/Greeting/Greeting";
import { siteConfig } from "@/config/site";

interface PropTypes {
  children: ReactNode;
  description?: ReactNode;
  title?: string;
  type?: string;
}

const DashboardLayout = (props: PropTypes) => {
  const { children, description, title, type = "admin" } = props;
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const SIDEBAR_ADMIN = siteConfig.navigation.sidebar.admin;
  const SIDEBAR_DIREKTUR = siteConfig.navigation.sidebar.direktur;

  return (
    <div className="max-w-screen-3xl 3xl:container flex">
      <Suspense fallback={<DashboardSidebarSkeleton />}>
        <DashboardLayoutSidebar
          isOpen={open}
          sidebarItems={type === "admin" ? SIDEBAR_ADMIN : SIDEBAR_DIREKTUR}
        />
      </Suspense>

      <div className="h-screen w-full overflow-y-auto">
        {/* Greeting Banner + Mobile Toggle */}
        <Greeting
          isOpen={open}
          name={session?.user?.name || "User"}
          onToggleSidebar={() => setOpen(!open)}
        />

        <div className="p-8">
          <h1 className="text-3xl font-bold text-brand">{title}</h1>
          <p className="text-small mb-5">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
