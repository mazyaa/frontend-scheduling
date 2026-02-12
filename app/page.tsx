"use client";

import { useContext, useEffect } from "react";
import { ToasterContext } from "@/context/ToasterContext";
import GridBackground from "@/components/GridBackground";
import Navbar from "@/components/layouts/navbar/Navbar";

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
    <>
      <Navbar />
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <GridBackground />
        <h1 className="text-3xl font-bold text-center text-brand z-999">
          Welcome to Veritrust Scheduling App
        </h1>
        <footer className="w-full flex items-center text-brand justify-center py-3 mt-auto">
          footer
        </footer>
      </section>
    </>
  );
}
