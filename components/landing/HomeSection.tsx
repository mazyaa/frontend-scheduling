"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@heroui/theme";

import GridBackground from "@/components/GridBackground";

const leftIcons = [
  {
    src: "/flying-icon/certificateIcon.png",
    className:
      "w-14 md:w-20 lg:w-[100px] h-auto top-[10%] left-[15%] md:left-[12%] lg:left-[25%]",
    delay: 0,
    duration: 4.2,
  },
  {
    src: "/flying-icon/online-learningIcon.png",
    className:
      "w-10 md:w-12 lg:w-16 h-auto top-[24%] left-[2%] md:left-[4%] lg:left-[7%]",
    delay: 1.3,
    duration: 5.0,
  },
  {
    src: "/flying-icon/calendarIcon.png",
    className:
      "w-14 md:w-20 lg:w-[100px] h-auto top-[44%] -left-6 md:-left-4 lg:left-[-1%]",
    delay: 0.5,
    duration: 3.8,
  },
  {
    src: "/flying-icon/clockIcon.png",
    className:
      "w-11 md:w-14 lg:w-[75px] h-auto top-[62%] left-[6%] md:left-[10%] lg:left-[15%]",
    delay: 2.1,
    duration: 4.6,
  },
  {
    src: "/flying-icon/assesement.png",
    className:
      "w-10 md:w-12 lg:w-[60px] h-auto top-[80%] left-[1%] md:left-[2%] lg:left-[3%] hidden lg:block md:block",
    delay: 0.8,
    duration: 5.4,
  },
];

const rightIcons = [
  {
    src: "/flying-icon/presentationIcon.png",
    className:
      "w-14 md:w-20 lg:w-[100px] h-auto top-[10%] right-[15%] md:right-[12%] lg:right-[25%]",
    delay: 0.7,
    duration: 4.8,
  },
  {
    src: "/flying-icon/open-bookIcon.png",
    className:
      "w-8 md:w-10 lg:w-[50px] h-auto top-[24%] right-[2%] md:right-[4%] lg:right-[7%]",
    delay: 1.8,
    duration: 3.6,
  },
  {
    src: "/flying-icon/validateIcon.png",
    className:
      "w-14 md:w-20 lg:w-[100px] h-auto top-[44%] -right-6 md:-right-4 lg:right-[-1%]",
    delay: 0.2,
    duration: 5.2,
  },
  {
    src: "/flying-icon/trueIcon.png",
    className:
      "w-11 md:w-14 lg:w-[75px] h-auto top-[62%] right-[6%] md:right-[10%] lg:right-[15%]",
    delay: 2.4,
    duration: 4.0,
  },
  {
    src: "/flying-icon/fast-timeIcon.png",
    className:
      "w-10 md:w-12 lg:w-[62px] h-auto top-[80%] right-[2%] md:right-[3%] lg:right-[4%] hidden lg:block md:block",
    delay: 1.0,
    duration: 4.4,
  },
];

const HomeSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GridBackground />

      <div className="block">
        {leftIcons.map((icon, i) => (
          <Image
            key={`l-${i}`}
            alt=""
            className={cn(
              "absolute pointer-events-none select-none opacity-80",
              icon.className,
            )}
            height={100}
            src={icon.src}
            style={{
              animation: `float ${icon.duration}s ease-in-out ${icon.delay}s infinite`,
            }}
            width={100}
          />
        ))}

        {rightIcons.map((icon, i) => (
          <Image
            key={`l-${i}`}
            alt=""
            className={cn(
              "absolute pointer-events-none select-none opacity-80",
              icon.className,
            )}
            height={100}
            src={icon.src}
            style={{
              animation: `float ${icon.duration}s ease-in-out ${icon.delay}s infinite`,
            }}
            width={100}
          />
        ))}
      </div>

      <div className="relative z-[999] w-full max-w-[900px] mx-auto px-4 lg:px-6 py-20">
        <div className="w-full rounded-[32px] bg-white p-8 md:p-12 lg:p-16 shadow-xl">
          <h1 className="text-center font-bold">
            <span className="block text-2xl md:text-5xl lg:text-6xl leading-tight bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              Pelatihan Terjadwal
            </span>

            <span className="block text-2xl md:text-5xl lg:text-6xl leading-tight text-teal-600">
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
