export type SiteConfig = typeof siteConfig;
import { IoHomeOutline } from "react-icons/io5";
import { GrSchedules } from "react-icons/gr";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { MdManageSearch } from "react-icons/md";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { FaPeopleGroup } from "react-icons/fa6";
import { RiBookShelfLine } from "react-icons/ri";
import { LuBookOpenCheck } from "react-icons/lu";
import { PiCertificate } from "react-icons/pi";
import { BsFileEarmarkArrowDown } from "react-icons/bs";

export type Role = "admin" | "instruktur" | "peserta" | "asesor" | "direktur";

export type MenuItem = {
  name: string;
  href?: string;
  icon?: React.ComponentType; // for menu items with icons
  isButton?: boolean; // indicates if the menu item is a button
  children?: MenuItem[]; // for nested menu items
};

export const siteConfig = {
  name: "Veritrust",
  description: "Pelatihan Terjadwal Sertifikat Terbit Digital",
  navigation: {
    // Menu untuk halaman public (user belum login)
    public: [
      { name: "Beranda", href: "/", icon: IoHomeOutline },
      { name: "Jadwal Training", href: "/jadwal-training", icon: GrSchedules },
      { name: "Login", href: "/login", isButton: true },
    ] as MenuItem[],

    // Menu sidebar khusus untuk dashboard (admin & direktur)
    sidebar: {
      admin: [
        {
          key: "dashboard",
          name: "Dashboard",
          href: "/admin/dashboard",
          icon: RiDashboardHorizontalFill,
        },
        {
          key: "kelola-training",
          name: "Kelola Daftar Training",
          href: "/admin/kelola-training",
          icon: MdManageSearch,
        },
        {
          key: "kelola-instruktur-asesor",
          name: "Kelola Instruktur & Asesor",
          href: "/admin/kelola-instruktur-asesor",
          icon: LiaChalkboardTeacherSolid,
        },
        {
          key: "kelola-jadwal-training",
          name: "Kelola Jadwal Training",
          href: "/admin/kelola-jadwal-training",
          icon: HiOutlineCalendarDateRange,
        },
        {
          key: "kelola-peserta",
          name: "Kelola Data Peserta",
          href: "/admin/kelola-peserta",
          icon: FaPeopleGroup,
        },
        {
          key: "kelola-materi-training",
          name: "Kelola Materi Training",
          href: "/admin/kelola-materi-training",
          icon: RiBookShelfLine,
        },
        {
          key: "kelola-penilaian",
          name: "Kelola Penilaian",
          href: "/admin/kelola-penilaian",
          icon: LuBookOpenCheck,
        },
        {
          key: "kelola-sertifikat",
          name: "Kelola E-Sertifikat",
          href: "/admin/kelola-sertifikat",
          icon: PiCertificate,
        },
        {
          key: "kelola-laporan",
          name: "Kelola Laporan",
          href: "/admin/kelola-laporan",
          icon: BsFileEarmarkArrowDown,
        },
      ],
      direktur: [
        {
          key: "dashboard",
          name: "Dashboard",
          href: "/direktur/dashboard",
          icon: RiDashboardHorizontalFill,
        },
        {
          key: "kelola-laporan",
          name: "Kelola Laporan",
          href: "/direktur/kelola-laporan",
          icon: BsFileEarmarkArrowDown,
        },
      ],
    },

    // Menu dengan dropdown (untuk role selain admin/direktur di navbar)
    role: {
      peserta: [
        { name: "Beranda", href: "/", icon: IoHomeOutline },
        {
          name: "Jadwal Training",
          href: "/jadwal-training",
          icon: GrSchedules,
        },
        {
          name: "Akun",
          children: [
            { name: "Profile Saya", href: "/peserta/profile" },
            { name: "Status Kompetensi", href: "/peserta/status-kompetensi" },
            { name: "Materi Training", href: "/peserta/materi-training" },
            { name: "Logout", href: "/", isButton: true },
          ],
        },
      ],

      instruktur: [
        { name: "Beranda", href: "/", icon: IoHomeOutline },
        {
          name: "Jadwal Training",
          href: "/jadwal-training",
          icon: GrSchedules,
        },
        {
          name: "Akun",
          children: [
            { name: "Profile Saya", href: "/instruktur/profile" },
            { name: "Daftar Peserta", href: "/daftar-peserta" },
            {
              name: "Kelola Materi Training",
              href: "/kelola-materi",
            },
            { name: "Logout", href: "/", isButton: true },
          ],
        },
      ],

      asesor: [
        { name: "Beranda", href: "/asesor", icon: IoHomeOutline },
        {
          name: "Jadwal Training",
          href: "/jadwal-training",
          icon: GrSchedules,
        },
        {
          name: "Akun",
          children: [
            { name: "Profile Saya", href: "/asesor/profile" },
            { name: "Daftar Peserta", href: "/daftar-peserta" },
            { name: "Kelola Penilaian", href: "/asesor/kelola-penilaian" },
            { name: "Logout", href: "/", isButton: true },
          ],
        },
      ],

      // Menu navbar untuk admin (saat di halaman public, bukan dashboard)
      admin: [
        { name: "Beranda", href: "/", icon: IoHomeOutline },
        {
          name: "Jadwal Training",
          href: "/jadwal-training",
          icon: GrSchedules,
        },
        {
          name: "Akun",
          children: [
            { name: "Dashboard", href: "/admin/dashboard" },
            { name: "Logout", href: "/", isButton: true },
          ],
        },
      ],

      // Menu navbar untuk direktur (saat di halaman public, bukan dashboard)
      direktur: [
        { name: "Beranda", href: "/", icon: IoHomeOutline },
        {
          name: "Jadwal Training",
          href: "/jadwal-training",
          icon: GrSchedules,
        },
        {
          name: "Akun",
          children: [
            { name: "Dashboard", href: "/direktur/dashboard" },
            { name: "Logout", href: "/", isButton: true },
          ],
        },
      ],
    },
  },
  links: {
    // github: "https://github.com/heroui-inc/heroui",
    // twitter: "https://twitter.com/hero_ui",
    // docs: "https://heroui.com",
    // discord: "https://discord.gg/9b6yyZKmH4",
    // sponsor: "https://patreon.com/jrgarciadev",
  },
};
