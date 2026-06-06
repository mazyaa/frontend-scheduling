"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { participantServices } from "@/services/participant.service";
import useChangeUrl from "@/hooks/useChangeUrl";

const useDaftarPeserta = (jadwalTrainingId: string) => {
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getPeserta = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    const response =
      await participantServices.getParticipantBySchedule(
        jadwalTrainingId,
        params,
      );
    const { results, pagination, instruktur, asesor } = response.data;

    return { results, pagination, instruktur, asesor };
  };

  const {
    data: dataDaftarPeserta,
    isLoading: isLoadingDaftarPeserta,
    isRefetching: isRefetchingDaftarPeserta,
    refetch: refetchDaftarPeserta,
  } = useQuery({
    queryKey: [
      "DaftarPeserta",
      jadwalTrainingId,
      currentPage,
      currentLimit,
      currentSearch,
    ],
    queryFn: getPeserta,
    enabled: !!jadwalTrainingId && !!currentPage && !!currentLimit,
    placeholderData: keepPreviousData,
  });

  return {
    dataDaftarPeserta,
    isLoading: isLoadingDaftarPeserta || isRefetchingDaftarPeserta,
    refetchDaftarPeserta,
  };
};

export default useDaftarPeserta;
