"use client";

import { useSession } from "next-auth/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import useChangeUrl from "@/hooks/useChangeUrl";
import { myTrainingServices } from "@/services/myTraining.service";

const useMyJadwalTraining = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getAllMyJadwal = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    const response = await myTrainingServices.getMyTraining(params);
    const { data, pagination } = response.data;

    return { data, pagination };
  };

  const {
    data: dataMyJadwal,
    isLoading: isLoadingMyJadwal,
    isRefetching: isRefetchingMyJadwal,
    refetch: refetchMyJadwal,
  } = useQuery({
    queryKey: ["MyJadwalTraining", currentPage, currentLimit, currentSearch],
    queryFn: getAllMyJadwal,
    enabled: !!currentPage && !!currentLimit && !!token,
    placeholderData: keepPreviousData,
  });

  return {
    dataMyJadwal,
    isLoadingMyJadwal,
    isRefetchingMyJadwal,
    refetchMyJadwal,
  };
};

export default useMyJadwalTraining;
