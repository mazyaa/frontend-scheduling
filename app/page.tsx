"use client";

import { useContext, useEffect } from "react";
import { ToasterContext } from "@/context/ToasterContext";

export default function Home() {
  const { setToaster } = useContext(ToasterContext);

  useEffect(() => {
    setToaster({
      title: "Info",
      type: "info",
      message: "Welcome to Veritrust Scheduling App.",
    });
  }, [setToaster]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className="text-3xl font-bold text-center text-brand">
        Welcome to Veritrust Scheduling App
      </h1>
    </section>
  );
}