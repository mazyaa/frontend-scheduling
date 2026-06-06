"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import useChangeUrl from "@/hooks/useChangeUrl";
import { myTrainingServices } from "@/services/myTraining.service";

const useSesiJadwal = () => {
  const params = useParams();
  const detailJadwalId = params.detailJadwalId as string;
  const jadwalId = params.id as string;
  const { data: session } = useSession();
  const token = session?.accessToken;
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getSesiJadwal = async () => {
    let queryParams = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      queryParams += `&search=${currentSearch}`;
    }

    const response = await myTrainingServices.getMyTrainingSession(
      detailJadwalId,
      queryParams,
    );

    const { data, pagination } = response.data;

    return { data, pagination };
  };

  const {
    data: dataSesiJadwal,
    isLoading: isLoadingSesiJadwal,
    isRefetching: isRefetchingSesiJadwal,
  } = useQuery({
    queryKey: [
      "MySesiJadwal",
      detailJadwalId,
      currentPage,
      currentLimit,
      currentSearch,
    ],
    queryFn: getSesiJadwal,
    enabled: !!detailJadwalId && !!currentPage && !!currentLimit && !!token,
    placeholderData: keepPreviousData,
  });

  return {
    dataSesiJadwal,
    isLoadingSesiJadwal,
    isRefetchingSesiJadwal,
    jadwalId,
    detailJadwalId,
  };
};

export default useSesiJadwal;
