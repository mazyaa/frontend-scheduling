"use client";

import { ReactNode, createContext, useState } from "react";

interface IToaster {
    title: string;
    type: string;
    message: string;
}

interface IToasterState {
  toaster: IToaster;
  setToaster: (toaster: IToaster) => void;
}

const defaultToaster = {
  title: "",  
  type: "",
  message: ""
}

const ToasterContext = createContext<IToasterState>({
    toaster: defaultToaster,
    setToaster: () => {},
});

const ToasterProvider = ({ children }: { children: ReactNode }) => {
  const [toaster, setToaster] = useState<IToaster>(defaultToaster);

  return (
    <ToasterContext.Provider value={{ toaster, setToaster}}>
      {children}
    </ToasterContext.Provider>
  );
}

export { ToasterContext, ToasterProvider, defaultToaster };
export type { IToaster, IToasterState };