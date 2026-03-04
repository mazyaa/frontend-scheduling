"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useRouter } from "next/navigation";

import { type MenuItem } from "@/config/site";

interface UserDropdownProps {
  menu: MenuItem;
  userName: string;
}

const UserDropdown = ({ menu, userName }: UserDropdownProps) => {
  const children = menu.children ?? [];

  const router = useRouter();
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          className="flex items-center gap-2 px-3 py-2 ml-4 font-medium text-sm bg-brand/5 text-brand rounded-xl border border-brand/10 hover:bg-brand/10 hover:border-brand/20 hover:shadow-md hover:shadow-brand/5 transition-all duration-200 cursor-pointer"
          variant="light"
        >
          <div className="relative">
            <Image
              alt="User"
              className="rounded-full ring-2 ring-brand/20"
              height={28}
              src="/Images/general/user.png"
              width={28}
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
          </div>
          <span className="hidden lg:inline">Halo, {userName}!</span>
          <svg
            className="w-3.5 h-3.5 opacity-60"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={menu.name}
        className="min-w-[200px]"
        variant="flat"
        onAction={(key) => {
          const child = children.find((c) => c.name === key);

          if (child?.isButton && child.name === "Logout") {
            handleLogout();
          }
        }}
      >
        {children.map((child) =>
          child.isButton ? (
            <DropdownItem
              key={child.name}
              className="text-danger"
              color="danger"
            >
              {child.name}
            </DropdownItem>
          ) : (
            <DropdownItem key={child.name} href={child.href}>
              {child.name}
            </DropdownItem>
          ),
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserDropdown;
