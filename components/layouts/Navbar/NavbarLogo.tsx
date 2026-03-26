import Image from "next/image";
import Link from "next/link";

const NavbarLogo = () => (
  <Link className="flex flex-row items-center ml-5 group" href="/">
    <Image
      alt="Veritrust Logo"
      className="m-2 transition-transform duration-300 group-hover:scale-105"
      height={100}
      src="/Images/general/main-logo.png"
      width={120}
    />
    <Image
      alt="Veritrust Tagline"
      className="m-2 hidden sm:block transition-opacity duration-300 group-hover:opacity-80"
      height={100}
      src="/Images/general/tagline.png"
      width={120}
    />
  </Link>
);

export default NavbarLogo;
