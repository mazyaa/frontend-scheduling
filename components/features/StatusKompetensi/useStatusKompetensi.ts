"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { penilaianServices } from "@/services/penilaian.service";
import useChangeUrl from "@/hooks/useChangeUrl";

const useStatusKompetensi = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getMyStatus = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    const response = await penilaianServices.getMyStatusPenilaian(params);
    const { data, pagination } = response.data;

    return { data, pagination };
  };

  const {
    data: dataStatusKompetensi,
    isLoading: isLoadingStatusKompetensi,
    isRefetching: isRefetchingStatusKompetensi,
    refetch: refetchStatusKompetensi,
  } = useQuery({
    queryKey: ["StatusKompetensi", currentPage, currentLimit, currentSearch],
    queryFn: getMyStatus,
    enabled: !!token && !!currentPage && !!currentLimit,
  });

  return {
    dataStatusKompetensi,
    isLoading: isLoadingStatusKompetensi || isRefetchingStatusKompetensi,
    refetchStatusKompetensi,
  };
};

export default useStatusKompetensi;
