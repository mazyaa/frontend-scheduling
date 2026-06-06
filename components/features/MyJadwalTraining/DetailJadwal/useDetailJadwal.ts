"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import useChangeUrl from "@/hooks/useChangeUrl";
import { myTrainingServices } from "@/services/myTraining.service";

const useDetailJadwal = () => {
  const params = useParams();
  const jadwalTrainingId = params.id as string;
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [selectedId, setSelectedId] = useState<string>("");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getDetailJadwal = async () => {
    let queryParams = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      queryParams += `&search=${currentSearch}`;
    }

    const response = await myTrainingServices.getMyTrainingDetail(
      jadwalTrainingId,
      queryParams,
    );

    const { data, pagination } = response.data;

    return { data, pagination };
  };

  const {
    data: dataDetailJadwal,
    isLoading: isLoadingDetailJadwal,
    isRefetching: isRefetchingDetailJadwal,
    refetch: refetchDetailJadwal,
  } = useQuery({
    queryKey: [
      "MyDetailJadwal",
      jadwalTrainingId,
      currentPage,
      currentLimit,
      currentSearch,
    ],
    queryFn: getDetailJadwal,
    enabled: !!jadwalTrainingId && !!currentPage && !!currentLimit && !!token,
    placeholderData: keepPreviousData,
  });

  return {
    dataDetailJadwal,
    isLoadingDetailJadwal,
    isRefetchingDetailJadwal,
    refetchDetailJadwal,
    selectedId,
    setSelectedId,
    jadwalTrainingId,
  };
};

export default useDetailJadwal;
