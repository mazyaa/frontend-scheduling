"use client";

import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";

const ProfileHeader = () => {
  return (
    <div className="mb-6">
      <div className="flex text-sm flex-row border-1 items-center border-brand justify-center rounded-2xl my-5 w-fit hover:bg-brand/10">
        <Link
          className="flex flex-row items-center gap-2 py-2 px-4 group"
          href={`/`}
        >
          <FaArrowLeftLong className="text-brand transition-transform duration-300 group-hover:-translate-x-1" />
          <p className="text-brand font-medium transition-transform duration-300 group-hover:scale-105">
            Kembali Ke -{" "}
            <span className="text-white bg-brand rounded-xl p-1.5 inline-block transition-transform duration-300 group-hover:scale-105">
              Beranda
            </span>
          </p>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-brand">Profile</h1>
      <p className="text-gray-600 mt-2">
        Kelola informasi profil dan keamanan akun anda!
      </p>
    </div>
  );
};

export default ProfileHeader;
