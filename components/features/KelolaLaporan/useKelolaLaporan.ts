"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { laporanServices } from "@/services/laporan.service";
import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import useChangeUrl from "@/hooks/useChangeUrl";

const useKelolaLaporan = (tabType: "sertifikat" | "peserta") => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const [selectedJadwalTrainingId, setSelectedJadwalTrainingId] =
    useState<string>("");
  const [selectedTahun, setSelectedTahun] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    setSelectedJadwalTrainingId("");
    setSelectedTahun("");
    setSelectedStatus("");
  }, [tabType]);

  const getLaporan = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    if (selectedJadwalTrainingId) {
      params += `&scheduleId=${selectedJadwalTrainingId}`;
    }

    if (selectedTahun) {
      params += `&tahun=${selectedTahun}`;
    }

    if (tabType === "peserta" && selectedStatus) {
      params += `&status=${selectedStatus}`;
    }

    const response =
      tabType === "sertifikat"
        ? await laporanServices.getLaporanSertifikat(params)
        : await laporanServices.getLaporanPeserta(params);

    const { data, pagination } = response.data;

    return {
      data,
      pagination,
    };
  };

  const {
    data: dataKelolaLaporan,
    isLoading: isLoadingKelolaLaporan,
    isRefetching: isRefetchingKelolaLaporan,
    refetch: refetchKelolaLaporan,
  } = useQuery({
    queryKey: [
      "KelolaLaporan",
      tabType,
      currentPage,
      currentLimit,
      currentSearch,
      selectedJadwalTrainingId,
      selectedTahun,
      selectedStatus,
    ],
    queryFn: getLaporan,
    gcTime: 0,
    enabled: !!currentPage && !!currentLimit && !!token,
  });

  const { data: dataFilterJadwal, isLoading: isLoadingFilterJadwal } = useQuery(
    {
      queryKey: ["JadwalTrainingFilterLaporan"],
      queryFn: async () => {
        const response =
          await kelolaJadwalServices.getAllSchedules("limit=100&page=1");

        return response.data.data;
      },
    },
  );

  return {
    dataKelolaLaporan,
    isLoadingKelolaLaporan,
    isRefetchingKelolaLaporan,
    refetchKelolaLaporan,
    selectedJadwalTrainingId,
    setSelectedJadwalTrainingId,
    selectedTahun,
    setSelectedTahun,
    selectedStatus,
    setSelectedStatus,
    dataFilterJadwal,
    isLoadingFilterJadwal,
  };
};

export default useKelolaLaporan;
