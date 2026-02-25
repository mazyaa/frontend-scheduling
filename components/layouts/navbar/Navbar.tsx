"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { HiMenuAlt3 } from "react-icons/hi";
import { Button } from "@heroui/button";

import NavbarLogo from "./NavbarLogo";
import DesktopMenu from "./DesktopMenu";
import MobileDrawer from "./MobileDrawer";
import { useNavigation } from "./useNavigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoading, authenticated, userName, visibleMenus } = useNavigation();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        animate={{
          backgroundColor: scrolled
            ? "rgba(255,255,255,0.85)"
            : "rgba(255,255,255,0.3)",
          boxShadow: scrolled
            ? "0 4px 30px rgba(0,0,0,0.08)"
            : "0 4px 20px rgba(0,0,0,0.04)",
          height: scrolled ? "64px" : "72px",
        }}
        className="sticky top-0 w-full backdrop-blur-md z-50"
        initial={false}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between h-full">
          <NavbarLogo />

          <DesktopMenu
            authenticated={authenticated}
            isLoading={isLoading}
            menus={visibleMenus}
            userName={userName}
          />

          {/* Mobile Toggle Button */}
          <Button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2 mr-4 rounded-xl text-brand hover:bg-brand/10 transition-all duration-200"
            onPress={toggleMenu}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.span
                  key="close"
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  initial={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <IoClose className="w-6 h-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  initial={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <HiMenuAlt3 className="w-6 h-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.nav>

      <MobileDrawer
        authenticated={authenticated}
        isLoading={isLoading}
        isOpen={isMenuOpen}
        menus={visibleMenus}
        onClose={closeMenu}
      />
    </>
  );
};

export default Navbar;
