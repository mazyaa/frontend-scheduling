"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import useChangeUrl from "@/hooks/useChangeUrl";
import { kelolaSesiJadwalServices } from "@/services/kelolaSesiJadwal";

const useKelolaSesiJadwal = () => {
  const params = useParams();
  const detailJadwalId = params.detailJadwalId as string;
  const jadwalId = params.id as string;
  const { data: session } = useSession();
  const [selectedId, setSelectedId] = useState<string>("");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getAllSessionSchedule = async () => {
    let queryParams = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      queryParams += `&search=${currentSearch}`;
    }

    const response =
      await kelolaSesiJadwalServices.getAllSessionScheduleByDetailScheduleId(
        detailJadwalId,
        queryParams,
      );

    const { data, pagination } = response.data;

    return {
      data,
      pagination,
    };
  };

  const {
    data: dataSesiJadwal,
    isLoading: isLoadingSesiJadwal,
    isRefetching: isRefetchingSesiJadwal,
    refetch: refetchSesiJadwal,
  } = useQuery({
    queryKey: [
      "KelolaSesiJadwal",
      detailJadwalId,
      currentPage,
      currentLimit,
      currentSearch,
    ],
    queryFn: getAllSessionSchedule,
    enabled: !!detailJadwalId && !!session,
    placeholderData: keepPreviousData, // for keeping previous data while fetching new data
  });

  return {
    dataSesiJadwal,
    isLoadingSesiJadwal,
    isRefetchingSesiJadwal,
    refetchSesiJadwal,

    selectedId,
    setSelectedId,
    jadwalId,
    detailJadwalId,
  };
};

export default useKelolaSesiJadwal;
