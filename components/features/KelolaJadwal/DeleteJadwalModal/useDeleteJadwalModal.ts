import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import errorHandling from "@/utils/errrorHandling";

const useDeleteJadwal = (refetchKelolaJadwal: () => void) => {
  const { setToaster } = useContext(ToasterContext);

  const deleteJadwalTrainingById = async (id: string) => {
    const response = await kelolaJadwalServices.deleteSchedule(id);

    return response;
  };

  const {
    mutate: mutateDeleteJadwalTraining,
    isPending: isPendingDeleteJadwalTraining,
    isSuccess: isSuccessDeleteJadwalTraining,
    reset: resetDeleteJadwalTraining,
  } = useMutation({
    mutationFn: deleteJadwalTrainingById,
    onError: (error) => {
      const message = errorHandling(error);

      setToaster({
        title: "Gagal menghapus jadwal training",
        type: "error",
        message:
          message || "Terjadi kesalahan dalam menghapus data jadwal training",
      });
    },
    onSuccess: () => {
      setToaster({
        title: "Berhasil menghapus jadwal training",
        type: "success",
        message: "Jadwal training berhasil dihapus",
      });

      refetchKelolaJadwal();
    },
  });

  return {
    handleDeleteTraining: mutateDeleteJadwalTraining,
    isPendingDeleteJadwalTraining,
    isSuccessDeleteJadwalTraining,
    resetDeleteJadwalTraining,
  };
};

export default useDeleteJadwal;
