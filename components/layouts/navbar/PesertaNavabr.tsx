"use client"

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation"
import { MockRole, useMockSession } from "@/hooks/useMockSession";
import Image from "next/image";
// import { useAuth } from "@/hooks/useAuth"

const PesertaNavbar = () => {
    const pathname = usePathname();
    const { user, role, isLoggedIn } = useMockSession();
    // const { user, role, isLogin, loading } = useAuth()

    // if (loading) return null;

    const PublicMenus = [
        { name: "Beranda", href: "/peserta"},
        { name: "Jadwal Training", href: "/peserta/jadwal-training"},
        { name: "Login", href: "/peserta/login"},
    ]

    const PesertaMenus = [
        { name: "Beranda", href: "/peserta"},
        { name: "Jadwal Training", href: "/peserta/jadwal-training"},
        { name: "Profile Saya", href: "/peserta/profile" },
        { name: "Materi Training", href: "/peserta/materi-training"},
    ]

    // const menus = isLogin && role === "peserta" ? PesertaMenus : PublicMenus;

    return (
        <nav className="w-full flex bg-white/30 backdrop-blur-sm shadow-lg h-auto bg:backdrop-blur-sm justify-between">
           <div className="flex flex-row items-center">
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
                    className="m-2"
                 />
           </div>

           <div className="flex flex-row items-center">
            {!isLoggedIn && PublicMenus.map((menu) => (
                <Link
                    key={menu.name}
                    href={menu.href}
                    className={`m-4 text-lg font-medium hover:text-brand ${pathname === menu.href ? "text-brand" : "text-foreground"}`}
                >
                    {menu.name}
                </Link>
            ))}
            {isLoggedIn && (role as MockRole) === "peserta" && PesertaMenus.map((menu) => (
                <Link
                    key={menu.name}
                    href={menu.href}
                    className={`m-4 text-lg font-medium hover:text-brand ${pathname === menu.href ? "text-brand" : "text-foreground"}`}
                >
                    {menu.name}
                </Link>
            ))}

           </div>
        </nav>
    )
}

export default PesertaNavbar;