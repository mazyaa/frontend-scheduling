"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

import useChangeUrl from "@/hooks/useChangeUrl";
import { kelolaTrainingServices } from "@/services/kelolaTraining.services";

const useKelolaTraining = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [selectedId, setSelectedId] = useState<string>("");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getTraining = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    const response = await kelolaTrainingServices.getAllTraining(params);
    const { data, pagination } = response.data;

    return {
      data,
      pagination,
    };
  };

  const {
    data: dataKelolaTraining,
    isLoading: isLoadingKelolaTraining,
    isRefetching: isRefetchingKelolaTraining,
    refetch: refetchKelolaTraining,
  } = useQuery({
    queryKey: ["KelolaTraining", currentPage, currentLimit, currentSearch], // for caching and refetching when these values change
    queryFn: getTraining, // fn for fetching data
    // only fetch data when on the correct page and both currentPage and currentLimit are available
    enabled:
      pathname === "/admin/kelola-daftar-training" && // only fetch or auto refetch when on the correct page
      !!currentPage &&
      !!currentLimit &&
      !!token,
  });

  return {
    dataKelolaTraining,
    isLoadingKelolaTraining,
    isRefetchingKelolaTraining,
    refetchKelolaTraining,
    selectedId,
    setSelectedId,
  };
};

export default useKelolaTraining;
