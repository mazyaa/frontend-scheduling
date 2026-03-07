"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";

import useChangeUrl from "@/hooks/useChangeUrl";
import { kelolaTrainingServices } from "@/services/kelolaTraining.services";
import { IKelolaTraining } from "@/types/kelolaTraining";

const useKelolaTraining = () => {
  const pathname = usePathname();
  const [selectedId, setSelectedId] = useState<string>("");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getTraining = async (): Promise<IKelolaTraining[]> => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    const response = await kelolaTrainingServices.getAllTraining(params);
    const { data } = response.data;

    return data;
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
    enabled: pathname === "/kelola-training" && !!currentPage && !!currentLimit,
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
