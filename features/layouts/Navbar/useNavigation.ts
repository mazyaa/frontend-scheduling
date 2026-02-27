"use client";

import { useSession } from "next-auth/react";

import { siteConfig, type MenuItem } from "@/config/site";

export function useNavigation() {
  const { status, data } = useSession();

  const isLoading = status === "loading";
  const authenticated = status === "authenticated";
  const userName = data?.user?.name ?? "";
  const role = authenticated ? data?.user?.role : null;

  const activeMenus: MenuItem[] = (() => {
    if (!authenticated || !role) return siteConfig.navigation.public;

    const roleMenus =
      siteConfig.navigation.role[
        role as keyof typeof siteConfig.navigation.role
      ];

    return roleMenus ?? siteConfig.navigation.public;
  })();

  // Filter out button-type items (Login/Logout) from the menu list
  const visibleMenus = activeMenus.filter((menu) => !menu.isButton);

  return {
    isLoading,
    authenticated,
    userName,
    visibleMenus,
  };
}
