"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { eSertifikatServices } from "@/services/eSertifikat.service";
import useChangeUrl from "@/hooks/useChangeUrl";

const useKelolaESertifikatAsesor = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const role = session?.user?.role;
  const [selectedId, setSelectedId] = useState<string>("");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getESertifikat = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
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
      "KelolaESertifikatAsesor",
      currentPage,
      currentLimit,
      currentSearch,
    ],
    queryFn: getESertifikat,
    enabled: !!currentPage && !!currentLimit && !!token,
  });

  return {
    dataKelolaESertifikat,
    isLoadingKelolaESertifikat,
    isRefetchingKelolaESertifikat,
    refetchKelolaESertifikat,
    selectedId,
    setSelectedId,
    role,
  };
};

export default useKelolaESertifikatAsesor;
