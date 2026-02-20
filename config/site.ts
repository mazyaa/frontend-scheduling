export type SiteConfig = typeof siteConfig;
import { IoHomeOutline } from "react-icons/io5";
import { BsPersonCircle } from "react-icons/bs";
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
  href: string;
  icon?: React.ComponentType; // use React.ComponentType for icon components
  isButton?: boolean; // indicates if the menu item is a button
  children?: MenuItem[]; // for nested menu items
}

export const siteConfig = {
  name: "Veritrust",
  description: "Pelatihan Terjadwal Sertifikat Terbit Digital",
  navigation: {
    public: [
        { name: "Beranda", href: "/", icon: IoHomeOutline },
        { name: "Jadwal Training", href: "/jadwal-training", icon: GrSchedules },
        { name: "Login", href: "/login", isButton: true },
        { name: "Logout", href:"/logout", isButton: true}
    ] as MenuItem[],

    role: {
      peserta: [
        { name: "Beranda", href: "/", icon: IoHomeOutline },
        { name: "Jadwal Training", href: "/jadwal-training", icon: GrSchedules },
        { 
          name: "Akun",
          icon: BsPersonCircle,
          children: [
            { name: "Profile Saya", href: "/peserta/profile" },
            { name: "Status Kompetensi", href: "/peserta/status-kompetensi" },
            { name: "Materi Training", href: "/peserta/materi-training" },
            { name: "Logout", href: "/logout", isButton: true },
          ]
        }
      ],


      instruktur: [
        { name: "Beranda", href: "/", icon: IoHomeOutline },
        { name: "Jadwal Training", href: "/jadwal-training", icon: GrSchedules },
        { 
          name: "Akun",
          icon: BsPersonCircle,
          children: [
            { name: "Profile Saya", href: "/instruktur/profile" },
            { name: "Daftar Peserta", href: "/daftar-peserta" },
            { name: "Kelola Materi Training", href: "/instruktur/kelola-materi" },
            { name: "Logout", href: "/logout", isButton: true },
          ]
        }
      ],

      asesor: [
        { name: "Beranda", href: "/asesor", icon: IoHomeOutline },
        { name: "Jadwal Asesmen", href: "/asesor/jadwal-asesmen", icon: GrSchedules },
        {
          name: "Akun",
          icon: BsPersonCircle,
          children: [
            { name: "Profile Saya", href: "/asesor/profile" },
            { name: "Daftar Peserta", href: "/daftar-peserta" },
            { name: "Kelola Penilaian", href: "/asesor/kelola-penilaian" },
            { name: "Logout", href: "/logout", isButton: true },
          ]
        }
      ],

      admin: [
        { name: "Dashboard", href: "/admin/dashboard", icon: RiDashboardHorizontalFill },
        { name: "Kelola Daftar Training", href: "/admin/kelola-training", icon: MdManageSearch },
        { name: "Kelola Instruktur & Asesor", href: "/admin/kelola-instruktur-asesor", icon: LiaChalkboardTeacherSolid },
        { name: "Kelola Jadwal Training", href: "/admin/kelola-jadwal-training", icon: HiOutlineCalendarDateRange },
        { name: "Kelola Data Peserta", href: "/admin/kelola-peserta", icon: FaPeopleGroup },
        { name: "Kelola Materi Training", href: "/admin/kelola-materi-training", icon: RiBookShelfLine },
        { name: "Kelola Penilaian", href: "/admin/kelola-penilaian", icon: LuBookOpenCheck},
        { name: "Kelola E-Sertifikat", href: "/admin/kelola-sertifikat", icon: PiCertificate },
        { name: "Kelola Laporan", href: "/admin/kelola-laporan", icon: BsFileEarmarkArrowDown },
      ],

      direktur: [
        { name: "Dashboard", href: "/direktur/dashboard", icon: RiDashboardHorizontalFill },
        { name: "Kelola Laporan", href: "/direktur/kelola-laporan", icon: BsFileEarmarkArrowDown },
      ],
      
    }
  },
  links: {
    // github: "https://github.com/heroui-inc/heroui",
    // twitter: "https://twitter.com/hero_ui",
    // docs: "https://heroui.com",
    // discord: "https://discord.gg/9b6yyZKmH4",
    // sponsor: "https://patreon.com/jrgarciadev",
  },
};
