"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { assesmentServices } from "@/services/assesment.service";
import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import useChangeUrl from "@/hooks/useChangeUrl";

const useKelolaPenilaian = (scheduleId?: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const role = session?.user?.role;
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedJadwalTrainingId, setSelectedJadwalTrainingId] =
    useState<string>(scheduleId || "");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const jadwalId = scheduleId || selectedJadwalTrainingId;

  const getPenilaian = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    let response;

    if (jadwalId) {
      response = await assesmentServices.getPenilaianByJadwal(jadwalId, params);
    } else {
      response = await assesmentServices.getAllPenilaian(params);
    }

    const { data, pagination } = response.data;

    return {
      data,
      pagination,
    };
  };

  const {
    data: dataKelolaPenilaian,
    isLoading: isLoadingKelolaPenilaian,
    isRefetching: isRefetchingKelolaPenilaian,
    refetch: refetchKelolaPenilaian,
  } = useQuery({
    queryKey: [
      "KelolaPenilaian",
      currentPage,
      currentLimit,
      currentSearch,
      jadwalId,
    ],
    queryFn: getPenilaian,
    enabled: !!currentPage && !!currentLimit && !!token,
  });

  const { data: dataFilterJadwal, isLoading: isLoadingFilterJadwal } = useQuery(
    {
      queryKey: ["JadwalTrainingFilterPenilaian"],
      queryFn: async () => {
        const response =
          await kelolaJadwalServices.getAllSchedules("limit=100&page=1");

        return response.data.data;
      },
    },
  );

  return {
    dataKelolaPenilaian,
    isLoadingKelolaPenilaian,
    isRefetchingKelolaPenilaian,
    refetchKelolaPenilaian,
    selectedId,
    setSelectedId,
    role,
    selectedJadwalTrainingId,
    setSelectedJadwalTrainingId,
    dataFilterJadwal,
    isLoadingFilterJadwal,
  };
};

export default useKelolaPenilaian;
