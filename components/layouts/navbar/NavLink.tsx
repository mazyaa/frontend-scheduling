"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { type MenuItem } from "@/config/site";

interface NavLinkProps {
  menu: MenuItem;
  onClick?: () => void;
  variant?: "desktop" | "mobile";
}

const variantStyles = {
  desktop: {
    active: "text-brand font-semibold",
    inactive: "text-gray-600 font-medium hover:text-brand",
  },
  mobile: {
    active: "text-brand bg-white font-semibold",
    inactive: "text-white font-semibold hover:text-brand hover:bg-white",
  },
};

const NavLink = ({ menu, onClick, variant = "desktop" }: NavLinkProps) => {
  const pathname = usePathname();

  if (!menu.href) return null;

  const styles = variantStyles[variant];
  const isActive = pathname === menu.href;

  if (variant === "desktop") {
    return (
      <Link
        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors duration-200 ${
          isActive ? styles.active : styles.inactive
        }`}
        href={menu.href}
        onClick={onClick}
      >
        {menu.icon && (
          <span className="w-4 h-4">
            <menu.icon />
          </span>
        )}
        {menu.name}

        {/* Active indicator underline */}
        {isActive && (
          <motion.span
            className="absolute -bottom-1 left-2 right-2 h-[2px] rounded-full bg-brand"
            layoutId="nav-underline"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    );
  }

  // Mobile variant
  return (
    <Link
      className={`flex items-center gap-2 px-3 py-3 rounded-lg transition-colors duration-200 ${
        isActive ? styles.active : styles.inactive
      }`}
      href={menu.href}
      onClick={onClick}
    >
      {menu.icon && (
        <span className="w-5 h-5">
          <menu.icon />
        </span>
      )}
      {menu.name}
    </Link>
  );
};

export default NavLink;
