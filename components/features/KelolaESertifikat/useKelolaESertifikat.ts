"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { eSertifikatServices } from "@/services/eSertifikat.service";
import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import useChangeUrl from "@/hooks/useChangeUrl";

const useKelolaESertifikat = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const role = session?.user?.role;
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedJadwalTrainingId, setSelectedJadwalTrainingId] =
    useState<string>("");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getESertifikat = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    if (selectedJadwalTrainingId) {
      params += `&scheduleId=${selectedJadwalTrainingId}`;
    }

    const response = await eSertifikatServices.getAllSertifikat(params);
    const { data, pagination } = response.data;

    return {
      data,
      pagination,
    };
  };

  const {
    data: dataKelolaESertifikat,
    isLoading: isLoadingKelolaESertifikat,
    isRefetching: isRefetchingKelolaESertifikat,
    refetch: refetchKelolaESertifikat,
  } = useQuery({
    queryKey: [
      "KelolaESertifikat",
      currentPage,
      currentLimit,
      currentSearch,
      selectedJadwalTrainingId,
    ],
    queryFn: getESertifikat,
    enabled: !!currentPage && !!currentLimit && !!token,
  });

  const { data: dataFilterJadwal, isLoading: isLoadingFilterJadwal } = useQuery(
    {
      queryKey: ["JadwalTrainingFilterESertifikat"],
      queryFn: async () => {
        const response =
          await kelolaJadwalServices.getAllSchedules("limit=100&page=1");

        return response.data.data;
      },
      enabled: !!token,
    },
  );

  return {
    dataKelolaESertifikat,
    isLoadingKelolaESertifikat,
    isRefetchingKelolaESertifikat,
    refetchKelolaESertifikat,
    selectedId,
    setSelectedId,
    role,
    selectedJadwalTrainingId,
    setSelectedJadwalTrainingId,
    dataFilterJadwal,
    isLoadingFilterJadwal,
  };
};

export default useKelolaESertifikat;
