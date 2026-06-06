"use client";

import Image from "next/image";
import Link from "next/link";

import GridBackground from "@/components/GridBackground";

const leftIcons = [
  { src: "/flying-icon/certificateIcon.png", size: 56, left: "2%", top: "8%", delay: 0, duration: 4.2 },
  { src: "/flying-icon/online-learningIcon.png", size: 64, left: "7%", top: "26%", delay: 1.3, duration: 5.0 },
  { src: "/flying-icon/calendarIcon.png", size: 48, left: "1%", top: "44%", delay: 0.5, duration: 3.8 },
  { src: "/flying-icon/clockIcon.png", size: 44, left: "8%", top: "62%", delay: 2.1, duration: 4.6 },
  { src: "/flying-icon/assesement.png", size: 60, left: "3%", top: "80%", delay: 0.8, duration: 5.4 },
];

const rightIcons = [
  { src: "/flying-icon/presentationIcon.png", size: 58, right: "3%", top: "12%", delay: 0.7, duration: 4.8 },
  { src: "/flying-icon/open-bookIcon.png", size: 50, right: "8%", top: "30%", delay: 1.8, duration: 3.6 },
  { src: "/flying-icon/validateIcon.png", size: 46, right: "2%", top: "48%", delay: 0.2, duration: 5.2 },
  { src: "/flying-icon/trueIcon.png", size: 54, right: "7%", top: "65%", delay: 2.4, duration: 4.0 },
  { src: "/flying-icon/fast-timeIcon.png", size: 62, right: "4%", top: "82%", delay: 1.0, duration: 4.4 },
];

const HomeSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GridBackground />

      <div className="hidden lg:block">
        {leftIcons.map((icon, i) => (
          <Image
            key={`l-${i}`}
            alt=""
            className="absolute pointer-events-none select-none opacity-80"
            height={icon.size}
            src={icon.src}
            style={{
              left: icon.left,
              top: icon.top,
              animation: `float ${icon.duration}s ease-in-out ${icon.delay}s infinite`,
            }}
            width={icon.size}
          />
        ))}
        {rightIcons.map((icon, i) => (
          <Image
            key={`r-${i}`}
            alt=""
            className="absolute pointer-events-none select-none opacity-80"
            height={icon.size}
            src={icon.src}
            style={{
              right: icon.right,
              top: icon.top,
              animation: `float ${icon.duration}s ease-in-out ${icon.delay}s infinite`,
            }}
            width={icon.size}
          />
        ))}
      </div>

      <div className="relative z-[999] w-full max-w-[900px] mx-auto px-4 lg:px-6 py-20">
        <div className="w-full rounded-[32px] bg-white p-8 md:p-12 lg:p-16 shadow-xl">
          <h1 className="text-center font-bold">
            <span className="block text-2xl md:text-5xl lg:text-6xl leading-tight bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              Pelatihan Terjadwal
            </span>

            <span className="block text-2xl md:text-5xl lg:text-6xl leading-tight text-teal-600 mt-2">
              Sertifikat Terbit Digital
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-center text-sm lg:text-lg lg:font-medium text-teal-700 leading-relaxed">
            Platform ini dirancang untuk memastikan penjadwalan pelatihan
            berlangsung secara tertata, sekaligus menyediakan fasilitas
            penerbitan sertifikat digital yang mudah dan cepat.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="inline-flex flex-col lg:flex-row items-center gap-2 border border-brand rounded-3xl p-2">
              <h2 className="bg-brand text-white py-1.5 px-3 rounded-2xl whitespace-nowrap text-sm lg:text-base font-medium">
                E-Sertifikat Palsu?
              </h2>

              <Link
                className="text-teal-600 font-medium whitespace-nowrap text-sm lg:text-base"
                href="/cek-sertifikat"
              >
                Coba aja &rarr;{" "}
                <span className="underline text-blue-700">
                  Cek Keabsahan E-Sertifikat
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
