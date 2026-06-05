"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import * as dashboardServices from "@/services/dashboard.service";

const useDashboard = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const role = session?.user?.role;

  const getDashboard = async () => {
    const response = await dashboardServices.dashboardServices.getDashboard();

    return response.data.data;
  };

  const {
    data: dataDashboard,
    isLoading: isLoadingDashboard,
    isRefetching: isRefetchingDashboard,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ["Dashboard", role],
    queryFn: getDashboard,
    enabled: !!token && !!role,
  });

  return {
    dataDashboard,
    isLoadingDashboard,
    isRefetchingDashboard,
    refetchDashboard,
    role,
  };
};

export default useDashboard;
