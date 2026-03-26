import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

import { kelolaTrainingServices } from "@/services/kelolaTraining.services";
import { ToasterContext } from "@/context/ToasterContext";

const useDeleteTrainingModal = (refetchTraining: () => void) => {
  const { setToaster } = useContext(ToasterContext);

  const deleteTrainingById = async (id: string) => {
    const response = await kelolaTrainingServices.deleteTraining(id);

    return response.data;
  };

  const {
    mutate: mutateDeleteTraining,
    isPending: isPendingDeleteTraining,
    isSuccess: isSuccessDeleteTraining,
    reset: resetDeleteTraining,
  } = useMutation({
    mutationFn: deleteTrainingById,
    onError: (error) => {
      setToaster({
        title: "Gagal menghapus training",
        type: "error",
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    },
    onSuccess: () => {
      setToaster({
        title: "Berhasil menghapus training",
        type: "success",
        message: "Training berhasil dihapus",
      });
      refetchTraining(); // refetch training data after delete training successfully
    },
  });

  return {
    handleDeleteTraining: mutateDeleteTraining,
    isPendingDeleteTraining,
    isSuccessDeleteTraining,
    resetDeleteTraining,
  };
};

export default useDeleteTrainingModal;
