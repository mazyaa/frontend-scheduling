"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import useChangeUrl from "@/hooks/useChangeUrl";
import { participantServices } from "@/services/participant.service";
import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import { IParticipant } from "@/types/participant";

const useKelolaPeserta = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedData, setSelectedData] = useState<IParticipant | null>(null);
  const [selectedJadwalTrainingId, setSelectedJadwalTrainingId] =
    useState<string>("");
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
          image:
            d.profilPeserta?.fileFoto || d.image || "/Images/general/user.png",
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

  const { data: dataFilterJadwal, isLoading: isLoadingFilterJadwal } = useQuery(
    {
      queryKey: ["JadwalTrainingFilter"],
      queryFn: async () => {
        const response =
          await kelolaJadwalServices.getAllSchedules("limit=100&page=1");

        return response.data.data;
      },
      enabled: pathname === "/admin/kelola-peserta" && !!token,
    },
  );

  const enrichedParticipants = useMemo(() => {
    const participants = dataKelolaPeserta?.data || [];
    const schedules = dataFilterJadwal || [];

    const scheduleMap: Record<string, any> = {};

    schedules.forEach((s: any) => {
      scheduleMap[s.id] = s;
    });

    return participants.map((p: IParticipant) => {
      const trainings = p.pesertaTraining || [];

      trainings.forEach((pt) => {
        const schedule = scheduleMap[pt.jadwalTrainingId];

        if (!pt.jadwalTraining.training && schedule?.training) {
          pt.jadwalTraining.training = schedule.training;
        }
      });

      return p;
    });
  }, [dataKelolaPeserta?.data, dataFilterJadwal]);

  const filteredParticipants = useMemo(() => {
    if (!selectedJadwalTrainingId) return enrichedParticipants;

    return enrichedParticipants.filter((p: IParticipant) => {
      const trainings = p.pesertaTraining || [];

      return trainings.some(
        (pt) => pt.jadwalTrainingId === selectedJadwalTrainingId,
      );
    });
  }, [enrichedParticipants, selectedJadwalTrainingId]);

  return {
    dataKelolaPeserta,
    isLoadingKelolaPeserta,
    isRefetchingKelolaPeserta,
    refetchKelolaPeserta,
    selectedId,
    setSelectedId,
    selectedData,
    setSelectedData,
    selectedJadwalTrainingId,
    setSelectedJadwalTrainingId,
    dataFilterJadwal,
    isLoadingFilterJadwal,
    filteredParticipants,
  };
};

export default useKelolaPeserta;
