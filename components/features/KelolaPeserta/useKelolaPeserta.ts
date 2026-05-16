"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

import useChangeUrl from "@/hooks/useChangeUrl";
import { participantServices } from "@/services/participant.service";
import { IParticipant } from "@/types/participant";

const useKelolaPeserta = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedData, setSelectedData] = useState<IParticipant | null>(null);
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getPeserta = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    const response = await participantServices.getAllParticipant(params);
    const { results: rawData, pagination } = response.data;

    const data = Array.isArray(rawData)
      ? rawData.map((d: any) => ({
          ...d,
          image: d.image || "/Images/general/user.png", // inject default image
        }))
      : [];

    return {
      data,
      pagination,
    };
  };

  const {
    data: dataKelolaPeserta,
    isLoading: isLoadingKelolaPeserta,
    isRefetching: isRefetchingKelolaPeserta,
    refetch: refetchKelolaPeserta,
  } = useQuery({
    queryKey: ["KelolaPeserta", currentPage, currentLimit, currentSearch],
    queryFn: getPeserta,
    enabled:
      pathname === "/admin/kelola-peserta" &&
      !!currentPage &&
      !!currentLimit &&
      !!token,
  });

  return {
    dataKelolaPeserta,
    isLoadingKelolaPeserta,
    isRefetchingKelolaPeserta,
    refetchKelolaPeserta,
    selectedId,
    setSelectedId,
    selectedData,
    setSelectedData,
  };
};

export default useKelolaPeserta;
