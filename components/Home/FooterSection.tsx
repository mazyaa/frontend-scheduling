import Image from "next/image";

export const FooterSection = () => {
  return (
    <footer className="bg-teal-700 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Image alt="logo" height={60} src="/images/logo.png" width={140} />
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Customer Service</h4>

            <p>
              veritrustgs@gmail.com
              <br />
              +62 818-1881-0021
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Office</h4>

            <p>
              Jl. Syeikh Nawawi Al Bantani,
              <br />
              Kota Serang
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Menu</h4>

            <ul className="space-y-2">
              <li>Home</li>
              <li>Jadwal Training</li>
              <li>Materi Training</li>
              <li>Cek Keabsahan Sertifikat</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center">
          Copyright © 2026 Veritrust. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
