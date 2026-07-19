"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { materiServices } from "@/services/materi.service";
import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import useChangeUrl from "@/hooks/useChangeUrl";

const useKelolaMateri = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const role = session?.user?.role;
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedJadwalTrainingId, setSelectedJadwalTrainingId] =
    useState<string>("");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getMateri = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    if (selectedJadwalTrainingId) {
      params += `&scheduleId=${selectedJadwalTrainingId}`;
    }

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
    queryKey: [
      "KelolaMateri",
      currentPage,
      currentLimit,
      currentSearch,
      role,
      selectedJadwalTrainingId,
    ],
    queryFn: getMateri,
    enabled: !!currentPage && !!currentLimit && !!token && !!role,
  });

  const { data: dataFilterJadwal, isLoading: isLoadingFilterJadwal } = useQuery(
    {
      queryKey: ["JadwalTrainingFilterMateri", role],
      queryFn: async () => {
        if (role !== "admin") {
          const response = await kelolaJadwalServices.getMySchedules();

          return (response.data.data || []).map((item: any) => ({
            id: item.value,
            _displayLabel: item.label,
          }));
        }

        const response =
          await kelolaJadwalServices.getAllSchedules("limit=100&page=1");

        return response.data.data;
      },
      enabled: !!role,
    },
  );

  return {
    dataKelolaMateri,
    isLoadingKelolaMateri,
    isRefetchingKelolaMateri,
    refetchKelolaMateri,
    selectedId,
    setSelectedId,
    role,
    selectedJadwalTrainingId,
    setSelectedJadwalTrainingId,
    dataFilterJadwal,
    isLoadingFilterJadwal,
  };
};

export default useKelolaMateri;
