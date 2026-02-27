"use client";

import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";

import NavLink from "./NavLink";
import UserDropdown from "./UserDropdown";

import { type MenuItem } from "@/config/site";

interface DesktopMenuProps {
  menus: MenuItem[];
  userName: string;
  isLoading: boolean;
  authenticated: boolean;
}

const DesktopMenu = ({
  menus,
  userName,
  isLoading,
  authenticated,
}: DesktopMenuProps) => (
  <div className="hidden md:flex flex-row items-center gap-1 mr-5">
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          animate={{ opacity: 1 }}
          className="flex gap-3"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-9 w-20 animate-pulse rounded-xl bg-gray-200/60"
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="menus"
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-row items-center gap-1"
          exit={{ opacity: 0, y: -4 }}
          initial={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {menus.map((menu, index) => {
            if (menu.children && menu.children.length > 0) {
              return (
                <motion.div
                  key={menu.name}
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <UserDropdown menu={menu} userName={userName} />
                </motion.div>
              );
            }

            return (
              <motion.div
                key={menu.name}
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <NavLink menu={menu} variant="desktop" />
              </motion.div>
            );
          })}

          {!authenticated && (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: menus.length * 0.05 }}
            >
              <Button
                className="px-5 py-2 ml-4 font-semibold bg-brand text-white rounded-xl hover:bg-brand/90 hover:shadow-lg hover:shadow-brand/20 transition-all duration-200 cursor-pointer"
                onPress={() => signIn()}
              >
                Login
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default DesktopMenu;
