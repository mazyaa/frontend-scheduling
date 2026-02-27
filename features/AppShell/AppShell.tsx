"use client";

import { ReactNode, useContext, useEffect } from "react";

import Toaster from "@/features/components/ui/Toaster/Toaster";
import { defaultToaster, ToasterContext } from "@/context/ToasterContext";
interface PropTypes {
  children: ReactNode;
  className?: string;
}

const AppShell = (props: PropTypes) => {
  const { children } = props;
  const { toaster, setToaster } = useContext(ToasterContext);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToaster(defaultToaster);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [toaster, setToaster]);

  return (
    <div>
      {children}
      {toaster.type !== "" && (
        <Toaster
          message={toaster.message}
          title={toaster.title}
          type={toaster.type}
        />
      )}
    </div>
  );
};

export default AppShell;
