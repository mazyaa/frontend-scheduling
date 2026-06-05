"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { materiServices } from "@/services/materi.service";
import useChangeUrl from "@/hooks/useChangeUrl";

const useKelolaMateri = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const role = session?.user?.role;
  const [selectedId, setSelectedId] = useState<string>("");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getMateri = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    // Role admin dan instruktur menggunakan getAllMateri
    // Role peserta menggunakan getMyMateri
    const response =
      role === "peserta"
        ? await materiServices.getMyMateri(params)
        : await materiServices.getAllMateri(params);

    const { data, pagination } = response.data;

    return {
      data,
      pagination,
    };
  };

  const {
    data: dataKelolaMateri,
    isLoading: isLoadingKelolaMateri,
    isRefetching: isRefetchingKelolaMateri,
    refetch: refetchKelolaMateri,
  } = useQuery({
    queryKey: ["KelolaMateri", currentPage, currentLimit, currentSearch, role],
    queryFn: getMateri,
    enabled: !!currentPage && !!currentLimit && !!token && !!role,
  });

  return {
    dataKelolaMateri,
    isLoadingKelolaMateri,
    isRefetchingKelolaMateri,
    refetchKelolaMateri,
    selectedId,
    setSelectedId,
    role,
  };
};

export default useKelolaMateri;
