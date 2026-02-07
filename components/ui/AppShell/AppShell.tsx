"use client";

import Toaster from "@/components/ui/Toaster/Toaster";
import { defaultToaster, ToasterContext } from "@/context/ToasterContext";
import { cn } from "@heroui/theme";
import { Inter } from "next/font/google";
import { ReactNode, useContext, useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface PropTypes {
  children: ReactNode;
  className?: string;
}

const AppShell = (props: PropTypes) => {
  const { children, className } = props;
  const { toaster, setToaster } = useContext(ToasterContext);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToaster(defaultToaster);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [toaster, setToaster]);

  return (
    <div className={cn(inter.className, className)}>
      {children}
      {toaster.type !== "" && (
        <Toaster
          title={toaster.title}
          type={toaster.type}
          message={toaster.message}
        />
      )}
    </div>
  );
};

export default AppShell;