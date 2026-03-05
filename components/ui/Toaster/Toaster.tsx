import { ReactNode, useEffect, useRef } from "react";
import { CiCircleCheck, CiCircleRemove, CiCircleInfo } from "react-icons/ci";
import { addToast } from "@heroui/toast";
import { cn } from "@heroui/theme";

const iconList: { [key: string]: ReactNode } = {
  success: <CiCircleCheck className="text-3xl text-success-55" />,
  error: <CiCircleRemove className="text-3xl text-destructive-55" />,
  info: <CiCircleInfo className="text-3xl text-primary-55" />,
  unauthorized: <CiCircleRemove className="text-3xl text-warning-55" />,
};

interface ToasterProps {
  title: string;
  type: string;
  message: string;
}

const Toaster = (props: ToasterProps) => {
  const { title, type, message } = props;
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const key = `${type}|${title}|${message}`;

    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    addToast({
      title,
      description: message,
      classNames: {
        base: cn([
          "fixed top-18 right-4 z-50",
          "inline-flex flex-col items-start gap-1",
          "w-auto max-w-[90vw] sm:max-w-md",
          "bg-white dark:bg-background shadow-md",
          "border border-l-8 rounded-md rounded-l-none",
          "border-primary-200 dark:border-primary-100 border-l-primary",
          "px-4 py-3",
        ]),
        title: "text-sm font-semibold text-left",
        description: "text-sm text-left break-words whitespace-pre-wrap",
      },
      icon: iconList[type],
    });
  }, [title, type, message]);

  return null;
};

export default Toaster;
