"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import useChangeUrl from "@/hooks/useChangeUrl";

const useDetailKelolaJadwal = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [selectedId, setSelectedId] = useState<string>("");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();
};

