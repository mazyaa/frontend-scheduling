"use client";

import { ReactNode, useState } from "react";
import { Navbar, NavbarMenuToggle } from "@heroui/navbar";

import DashboardLayoutSidebar from "./DashboardLayoutSidebar";

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

  const SIDEBAR_ADMIN = siteConfig.navigation.sidebar.admin;
  const SIDEBAR_DIREKTUR = siteConfig.navigation.sidebar.direktur;

  return (
    <div className="max-w-screen-3xl 3xl:container flex">
      <DashboardLayoutSidebar
        isOpen={open}
        sidebarItems={type === "admin" ? SIDEBAR_ADMIN : SIDEBAR_DIREKTUR}
      />

      <div className="h-screen w-full overflow-y-auto p-8">
        {/* NAVBAR MOBILE */}
        <Navbar
          className="flex justify-between bg-transparent px-0"
          classNames={{ wrapper: "p-0" }} // Remove default padding
          isBlurred={false}
          position="static"
        >
          <h1 className="text-3xl font-bold text-brand">{title}</h1>
          <NavbarMenuToggle
            aria-label={open ? "Close menu" : "Open menu"}
            className="lg:hidden"
            onClick={() => setOpen(!open)}
          />
        </Navbar>
        <p className="text-small mb-5">{description}</p>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
