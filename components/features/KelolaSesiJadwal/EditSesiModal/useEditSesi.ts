import { useContext, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UseFormReset } from "react-hook-form";

import useKelolaSesiJadwal from "../useKelolaSesiJadwal";
import { kelolaSesiJadwalServices } from "@/services/kelolaSesiJadwal";
import { ToasterContext } from "@/context/ToasterContext";
import errorHandling from "@/utils/errrorHandling";
import { IKelolaSesiJadwal } from "@/types/kelolaSesiJadwal";

interface Props {
  selectedId: string;
  isOpen: boolean;
  refetchSesiJadwal: () => void;
  onOpenChange: () => void;
  reset: UseFormReset<Omit<IKelolaSesiJadwal, "id">>;
  detailJadwalId: string;
}

const useEditSesi = ({
  selectedId,
  isOpen,
  refetchSesiJadwal,
  onOpenChange,
  reset,
  detailJadwalId,
}: Props) => {
  const { setToaster } = useContext(ToasterContext);
  const { dataSesiJadwal } = useKelolaSesiJadwal();

  const { data: detailSesi, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["DetailSesiJadwal", selectedId],
    queryFn: async () => {
      const response =
        await kelolaSesiJadwalServices.getSessionScheduleByDetailJadwalId(
          selectedId,
        );

      return response.data;
    },
    enabled: !!selectedId && isOpen,
  });

  useEffect(() => {
    if (detailSesi) {
      reset({
        detailJadwalTrainingId:
          detailSesi.data.detailJadwalTrainingId || detailJadwalId,
        jamMulai: detailSesi.data.jamMulai,
        jamSelesai: detailSesi.data.jamSelesai,
        aktivitas: detailSesi.data.aktivitas,
        pic: detailSesi.data.pic || "",
      });
    }
  }, [detailSesi, reset, detailJadwalId]);

  const { mutate: handleEditSesi, isPending } = useMutation({
    mutationFn: async (payload: Partial<Omit<IKelolaSesiJadwal, "id">>) => {
      const res = await kelolaSesiJadwalServices.updateSessionSchedule(
        selectedId,
        payload,
      );

      return res.data;
    },
    onSuccess: () => {
      setToaster({
        title: "Berhasil",
        type: "success",
        message: "Berhasil mengubah sesi jadwal",
      });
      refetchSesiJadwal();
      onOpenChange();
    },
    onError: (error: any) => {
      const message = errorHandling(error);

      setToaster({
        title: "Gagal mengubah sesi",
        type: "error",
        message: message || "Gagal mengubah sesi jadwal",
      });
    },
  });

  return {
    handleEditSesi,
    isPending,
    isLoadingDetail,
    dataDetailSesi: detailSesi?.data,
    instrukturName:
      detailSesi?.data?.detailJadwalTraining?.instruktur?.name ||
      dataSesiJadwal?.data?.[0]?.detailJadwalTraining?.instruktur?.name,
    asesorName:
      detailSesi?.data?.detailJadwalTraining?.asesor?.name ||
      dataSesiJadwal?.data?.[0]?.detailJadwalTraining?.asesor?.name,
  };
};

export default useEditSesi;
