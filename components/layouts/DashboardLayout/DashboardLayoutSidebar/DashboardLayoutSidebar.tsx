import { Button } from "@heroui/button";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { CiLogout } from "react-icons/ci";
import Link from "next/link";
import { cn } from "@heroui/theme";
import { useRouter, usePathname } from "next/navigation";

interface ISidebarItem {
  key: string;
  name: string;
  href: string;
  icon: React.ComponentType;
}

interface PropTypes {
  sidebarItems: ISidebarItem[];
  isOpen: boolean;
}

const DashboardLayoutSidebar = (props: PropTypes) => {
  const { sidebarItems, isOpen } = props;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "lg:relative fixed z-50 flex h-screen w-full max-w-[300px] -translate-x-full flex-col justify-between border-r-1 border-default-200 bg-white px-4 py-6 transition-all lg:translate-x-0",
        {
          "translate-x-0": isOpen, // Show sidebar when isOpen is true
        },
      )}
    >
      <div className="flex justify-center flex-col items-center">
        <Image
          alt="Logo Veritrust"
          className="mb-5 cursor-pointer"
          height={150}
          src="/Images/general/main-logo.png"
          width={150}
          onClick={() => router.push("/")}
        />

        <Listbox
          aria-label="Dashboard Menu"
          items={sidebarItems}
          variant="solid"
        >
          {(item) => (
            <ListboxItem
              key={item.key}
              aria-describedby={item.name}
              aria-labelledby={item.name}
              as={Link}
              className={cn("my-1 h-12 text-2xl", {
                "bg-brand text-white": pathname.startsWith(item.href),
              })}
              href={item.href}
              startContent={<item.icon />} // use the icon component as the start content
            >
              <p className="text-small">{item.name}</p>
            </ListboxItem>
          )}
        </Listbox>
      </div>
      <div className="flex items-center p-1">
        <Button
          fullWidth
          className="flex justify-center rounded-lg text-brand"
          size="md"
          variant="light"
          onPress={() => signOut()}
        >
          <CiLogout />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardLayoutSidebar;
