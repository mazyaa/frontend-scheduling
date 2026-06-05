"use client";

import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const socialLinks = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaTiktok, href: "#", label: "TikTok" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
];

const menuLinks = [
  { label: "Home", href: "/" },
  { label: "Jadwal Training", href: "/jadwal-training" },
  { label: "Materi Training", href: "/materi-training" },
  { label: "Cek Keabsahan E-Sertifikat", href: "/cek-sertifikat" },
];

const FooterSection = () => {
  return (
    <footer className="relative z-[999] bg-teal-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Logo */}
          <div className="flex items-center p-4 w-max h-auto">
            <Image
              alt="Veritrust Logo"
              className="object-contain bg-white rounded-lg"
              height={60}
              src="/Images/general/main-logo.png"
              width={200}
            />
          </div>

          {/* Customer Service + Office */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-2">Customer Service</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                veritrustgs@gmail.com
                <br />
                +62 818-1881-0021
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Office</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                Jl. Syeikh Nawawi Al Bantani,
                <br />
                Komplek NABE Blok A2 No. 6,
                <br />
                Kota Serang 42122.
              </p>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Menu</h4>
            <ul className="space-y-2">
              {menuLinks.map((link) => (
                <li key={link.label}>
                  <span className="text-white/80 text-sm hover:text-white cursor-pointer transition-colors">
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Social Media</h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/25 transition-colors"
                    href={social.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/20 text-center text-sm text-white/70">
          Copyright &copy; 2026 Veritrust. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
