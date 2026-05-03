import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { UseFormReset } from "react-hook-form";

import useKelolaSesiJadwal from "../useKelolaSesiJadwal";

import { kelolaSesiJadwalServices } from "@/services/kelolaSesiJadwal";
import { ToasterContext } from "@/context/ToasterContext";
import errorHandling from "@/utils/errrorHandling";
import { IKelolaSesiJadwal } from "@/types/kelolaSesiJadwal";

interface Props {
  refetchSesiJadwal: () => void;
  onOpenChange: () => void;
  reset: UseFormReset<Omit<IKelolaSesiJadwal, "id">>;
}

const useTambahSesi = ({ refetchSesiJadwal, onOpenChange, reset }: Props) => {
  const { dataSesiJadwal, isLoadingSesiJadwal, isRefetchingSesiJadwal } =
    useKelolaSesiJadwal();
  const { setToaster } = useContext(ToasterContext);

  const { mutate: handleTambahSesi, isPending } = useMutation({
    mutationFn: async (payload: Omit<IKelolaSesiJadwal, "id">) => {
      const res =
        await kelolaSesiJadwalServices.createSingleSessionSchedule(payload);

      return res.data;
    },
    onSuccess: () => {
      setToaster({
        title: "Berhasil",
        type: "success",
        message: "Berhasil menambahkan sesi jadwal",
      });
      refetchSesiJadwal();
      reset();
      onOpenChange();
    },
    onError: (error: any) => {
      const message = errorHandling(error);

      setToaster({
        title: "Gagal menambahkan sesi",
        type: "error",
        message: message || "Gagal menambahkan sesi jadwal",
      });
    },
  });

  return {
    handleTambahSesi,
    isPending,
    dataDetailSesi: dataSesiJadwal?.data,
    isLoadingSesiJadwal,
    isRefetchingSesiJadwal,
  };
};

export default useTambahSesi;
