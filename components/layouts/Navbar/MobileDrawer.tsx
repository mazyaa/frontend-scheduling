"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@heroui/button";
import Image from "next/image";

import NavLink from "./NavLink";

import { type MenuItem } from "@/config/site";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  menus: MenuItem[];
  isLoading: boolean;
  authenticated: boolean;
}

const MobileDrawer = ({
  isOpen,
  onClose,
  menus,
  isLoading,
  authenticated,
}: MobileDrawerProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply blur to the main page content when drawer is open
  useEffect(() => {
    if (!mounted) return;

    const root = document.body.firstElementChild as HTMLElement | null;

    if (!root) return;

    if (isOpen) {
      root.style.filter = "blur(4px)";
      root.style.transition = "filter 0.3s ease";
    } else {
      root.style.filter = "";
    }

    return () => {
      root.style.filter = "";
    };
  }, [isOpen, mounted]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            aria-hidden="true"
            className="fixed inset-0 z-[998] md:hidden bg-black/40"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.div
        animate={{ x: isOpen ? 0 : "100%" }}
        className="fixed top-0 right-0 h-screen w-72 bg-gradient-to-b from-brand to-brand/95 backdrop-blur-xl shadow-2xl z-[999] md:hidden flex flex-col"
        initial={{ x: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <span className="text-white font-semibold text-lg tracking-wide">
            Menu
          </span>
          <Button
            aria-label="Close menu"
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            onPress={onClose}
          >
            <IoClose className="w-5 h-5" />
          </Button>
        </div>

        {/* Links */}
        <div className="flex flex-col p-4 gap-1 flex-1 overflow-y-auto">
          <AnimatePresence>
            {isOpen &&
              menus.map((menu, index) => {
                // Menu with children → render inline
                if (menu.children && menu.children.length > 0) {
                  return (
                    <motion.div
                      key={menu.name}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      initial={{ opacity: 0, x: 20 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.06,
                      }}
                    >
                      <span className="flex items-center gap-2 px-3 py-2 mt-3 mb-1 text-white/50 font-semibold text-xs uppercase tracking-widest">
                        <Image
                          alt="User"
                          className="rounded-full ring-2 ring-brand/20"
                          height={28}
                          src="/Images/general/user.png"
                          width={28}
                        />
                        {menu.name}
                      </span>

                      {menu.children.map((child, childIdx) =>
                        child.isButton && child.name === "Logout" ? (
                          <motion.div
                            key={child.name}
                            animate={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: 20 }}
                            transition={{
                              duration: 0.3,
                              delay: (index + childIdx + 1) * 0.06,
                            }}
                          >
                            <Button
                              className="w-full px-4 py-2.5 bg-red-500/90 text-red-200 border border-red-400/20 rounded-xl hover:bg-red-500/30 transition-all duration-200 cursor-pointer font-semibold mt-3"
                              onPress={() => {
                                signOut();
                                onClose();
                              }}
                            >
                              {child.name}
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div
                            key={child.name}
                            animate={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: 20 }}
                            transition={{
                              duration: 0.3,
                              delay: (index + childIdx + 1) * 0.06,
                            }}
                          >
                            <NavLink
                              menu={child}
                              variant="mobile"
                              onClick={onClose}
                            />
                          </motion.div>
                        ),
                      )}
                    </motion.div>
                  );
                }

                // Regular link
                return (
                  <motion.div
                    key={menu.name}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    initial={{ opacity: 0, x: 20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.06,
                    }}
                  >
                    <NavLink menu={menu} variant="mobile" onClick={onClose} />
                  </motion.div>
                );
              })}
          </AnimatePresence>

          {/* Login button — only when NOT authenticated & not loading */}
          {!authenticated && !isLoading && (
            <motion.div
              animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: menus.length * 0.06 }}
            >
              <Button
                className="w-full px-4 py-2.5 bg-white text-brand rounded-xl hover:bg-white/90 hover:shadow-lg transition-all duration-200 cursor-pointer font-semibold mt-4"
                onPress={() => {
                  signIn();
                  onClose();
                }}
              >
                Login
              </Button>
            </motion.div>
          )}
        </div>

        {/* Bottom branding */}
        <div className="p-4 border-t border-white/10">
          <p className="text-white/30 text-xs text-center">
            &copy; 2026 Veritrust
          </p>
        </div>
      </motion.div>
    </>,
    document.body,
  );
};

export default MobileDrawer;
