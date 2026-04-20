"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import useChangeUrl from "@/hooks/useChangeUrl";
import { kelolaDetailJadwalServices } from "@/services/kelolaDetailJadwal.service";

const useDetailJadwal = () => {
  // const pathname = usePathname();
  const params = useParams();
  const id = params.id;
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [selectedId, setSelectedId] = useState<string>("");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getAllDetailSchedule = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    const response = await kelolaDetailJadwalServices.getAllDetailJadwal(
      id as string,
      params,
    );

    const { data, pagination } = response.data;

    return {
      data,
      pagination,
    };
  };

  const {
    data: dataDetailJadwal,
    isLoading: isLoadiangDetailJadwal,
    isRefetching: isRefetchingDetailJadwal,
    refetch: refetchDetailKelolaJadwal,
  } = useQuery({
    queryKey: ["DetailKelolaJadwal", currentPage, currentLimit, currentSearch],
    queryFn: getAllDetailSchedule,
    enabled: !!id && !!currentPage && !!currentLimit && !!token,
  });

  return {
    dataDetailJadwal,
    isLoadiangDetailJadwal,
    isRefetchingDetailJadwal,
    refetchDetailKelolaJadwal,

    selectedId,
    setSelectedId,
  };
};

export default useDetailJadwal;
