"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import { kelolaTrainingServices } from "@/services/kelolaTraining.service";
import useChangeUrl from "@/hooks/useChangeUrl";

const useKelolaJadwal = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [selectedId, setSelectedId] = useState<string>("");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getAllSchedules = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    const response = await kelolaJadwalServices.getAllSchedules(params);
    const { data, pagination } = response.data;

    return {
      data,
      pagination,
    };
  };

  const { data: dataKelolaTraining, isLoading: isLoadingKelolaTraining } =
    useQuery({
      queryKey: ["KelolaTrainingAll"],
      queryFn: async () => {
        const response =
          await kelolaTrainingServices.getAllTraining("limit=9999&page=1");

        return response.data;
      },
      enabled: pathname === "/admin/kelola-jadwal-training" && !!token,
    });

  const {
    data: dataKelolaJadwal,
    isLoading: isLoadingKelolaJadwal,
    isRefetching: isRefetchingKelolaJadwal,
    refetch: refetchKelolaJadwal,
  } = useQuery({
    queryKey: ["KelolaJadwal", currentPage, currentLimit, currentSearch],
    queryFn: getAllSchedules,
    enabled:
      pathname === "/admin/kelola-jadwal-training" &&
      !!currentPage &&
      !!currentLimit &&
      !!token,
  });

  return {
    dataKelolaJadwal,
    isLoadingKelolaJadwal,
    isRefetchingKelolaJadwal,
    refetchKelolaJadwal,
    selectedId,
    setSelectedId,

    dataKelolaTraining,
    isLoadingKelolaTraining,
  };
};

export default useKelolaJadwal;
