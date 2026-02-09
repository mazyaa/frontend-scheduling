"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MockRole, useMockSession } from "@/hooks/useMockSession";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { HiMenuAlt3 } from "react-icons/hi";
import { siteConfig } from "@/config/site";
// import { signOut } from "next-auth/react";
// import { useAuth } from "@/hooks/useAuth"

const Navbar = () => {
  const pathname = usePathname();
  const { user, role, isLoggedIn } = useMockSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { user, role, isLogin, loading } = useAuth()

  // if (loading) return null;

  const PublicMenus = siteConfig.navigation.public;

  // const menus = isLogin && role === "peserta" ? PesertaMenus : PublicMenus;

  const [mounted, setMounted] = useState(false); // use to track if component is mounted

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev); // toggle menu open state
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="w-full bg-white/30 backdrop-blur-sm shadow-lg h-auto relative z-50">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex flex-row items-center ml-5">
            <Image
              src="/images/general/main-logo.png"
              alt="Veritrust Logo"
              width={120}
              height={100}
              className="m-2"
            />

            <Image
              src="/images/general/tagline.png"
              alt="Veritrust Logo"
              width={120}
              height={100}
              className="m-2 hidden sm:block"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-row items-center mr-5">
            {!isLoggedIn &&
              PublicMenus.map((menu) => (
                <Link
                  key={menu.name}
                  href={menu.href}
                  className={`flex items-center px-3 py-3 rounded-lg ${
                    pathname === menu.href
                      ? "text-cyan-600 text-sm font-semibold"
                      : "text-brand hover:text-brand/70 font-semibold text-sm"
                  }`}
                >
                  {menu.icon && (
                    <span className="w-5 h-5">
                      <menu.icon />
                    </span>
                  )}
                  {menu.isButton ? (
                    <span className="px-4 py-2 ml-7 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                      {menu.name}
                    </span>
                  ) : (
                    menu.name
                  )}
                </Link>
              ))}

            {/* if logged in */}
            {/* {isLoggedIn &&
              (role as MockRole) === "peserta" &&
              PesertaMenus.map((menu) => (
                <Link
                  key={menu.name}
                  href={menu.href}
                  className={`m-4 text-lg font-medium hover:text-brand ${pathname === menu.href ? "text-brand" : "text-foreground"}`}
                >
                  {menu.name}
                </Link>
              ))} */}
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 mr-3 rounded-lg text-brand hover:bg-brand/10 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <IoClose className="w-6 h-6" />
            ) : (
              <HiMenuAlt3 className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay + Drawer (portaled to body) */}
      {mounted &&
        createPortal(
          <>
            {/* Overlay */}
            <div
              className={`fixed inset-0 z-[998] md:hidden transition-all duration-300 ${
                isMenuOpen
                  ? "bg-black/30 backdrop-blur-sm pointer-events-auto"
                  : "pointer-events-none bg-transparent"
              }`}
              onClick={closeMenu}
            />

            {/* Drawer */}
            <div
              className={`
                           fixed top-0 right-0 h-screen w-64 bg-brand/90 backdrop-blur-lg shadow-xl z-[999]
                           transform transition-transform duration-300 ease-in-out
                           md:hidden flex flex-col
                           ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
                       `}
            >
              {/* Close button inside drawer */}
              <div className="flex items-center justify-between p-4 border-b-brand">
                <span className="text-white font-semibold text-lg">Menu</span>
                <button
                  onClick={closeMenu}
                  className="p-1 rounded-lg text-white hover:bg-brand/90 transition-colors"
                  aria-label="Close menu"
                >
                  <IoClose className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Menu Links */}
              <div className="flex flex-col p-4 gap-2 flex-1 overflow-y-auto">
                {!isLoggedIn &&
                  PublicMenus.map((menu) => (
                    <Link
                      key={menu.name}
                      href={menu.href}
                      onClick={closeMenu}
                      className={`flex items-center gap-2 px-3 py-3 rounded-lg ${
                        pathname === menu.href
                          ? "text-brand bg-white font-semibold"
                          : "text-white hover:text-brand hover:bg-white"
                      }`}
                    >
                      {menu.icon && (
                        <span className="w-5 h-5">
                          <menu.icon />
                        </span>
                      )}
                      {menu.name}
                    </Link>
                  ))}


                {/* {isLoggedIn &&
                  (role as MockRole) === "peserta" &&
                  PesertaMenus.map((menu) => (
                    <Link
                      key={menu.name}
                      href={menu.href}
                      onClick={closeMenu}
                      className={`flex items-center gap-2 px-3 py-3 rounded-lg transition-colors ${
                        pathname === menu.href
                          ? "bg-brand/10 text-brand font-semibold"
                          : "text-foreground hover:bg-brand/5 hover:text-brand"
                      }`}
                    >
                      {menu.name}
                    </Link>
                  ))} */}

              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
};

export default Navbar;
