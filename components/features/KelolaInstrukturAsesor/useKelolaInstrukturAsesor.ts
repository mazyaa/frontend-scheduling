"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

import useChangeUrl from "@/hooks/useChangeUrl";
import { kelolaInstrukturAsesorServices } from "@/services/kelolaInstrukturAsesor";

const useKelolaInstrukturAsesor = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [selectedId, setSelectedId] = useState<string>("");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getInstrukturAsesor = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    const response =
      await kelolaInstrukturAsesorServices.getAllInstrukturAndAsesor(params);
    const { data, pagination } = response.data;

    return {
      data,
      pagination,
    };
  };

  const {
    data: dataKelolaInstrukturAsesor,
    isLoading: isLoadingKelolaInstrukturAsesor,
    isRefetching: isRefetchingKelolaInstrukturAsesor,
    refetch: refetchKelolaInstrukturAsesor,
  } = useQuery({
    queryKey: [
      "KelolaInstrukturAsesor",
      currentPage,
      currentLimit,
      currentSearch,
    ], // for caching and refetching when these values change
    queryFn: getInstrukturAsesor, // fn for fetching data
    // only fetch data when on the correct page and both currentPage and currentLimit are available
    enabled:
      pathname === "/admin/kelola-instruktur-asesor" && // only fetch or auto refetch when on the correct page
      !!currentPage &&
      !!currentLimit &&
      !!token,
  });

  return {
    dataKelolaInstrukturAsesor,
    isLoadingKelolaInstrukturAsesor,
    isRefetchingKelolaInstrukturAsesor,
    refetchKelolaInstrukturAsesor,
    selectedId,
    setSelectedId,
  };
};

export default useKelolaInstrukturAsesor;
