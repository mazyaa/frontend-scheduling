import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import { participantServices } from "@/services/participant.service";
import errorHandling from "@/utils/errrorHandling";

const useDeletePesertaModal = () => {
  const { setToaster } = useContext(ToasterContext);

  const {
    mutate: handleDeletePeserta,
    isPending: isPendingMutateDeletePeserta,
    isSuccess: isSuccessMutateDeletePeserta,
  } = useMutation({
    mutationFn: async (id: string) => {
      const response = await participantServices.deleteParticipant(id);

      return response;
    },
    onSuccess: () => {
      setToaster({
        type: "success",
        title: "Berhasil",
        message: "Berhasil menghapus data",
      });
    },
    onError: (error) => {
      setToaster({
        type: "error",
        title: "Gagal",
        message: errorHandling(error),
      });
    },
  });

  return {
    handleDeletePeserta,
    isPendingMutateDeletePeserta,
    isSuccessMutateDeletePeserta,
  };
};

export default useDeletePesertaModal;
