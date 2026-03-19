import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

import { kelolaInstrukturAsesorServices } from "@/services/kelolaInstrukturAsesor";
import { ToasterContext } from "@/context/ToasterContext";

const useDeleteInstrukturAsesorModal = (
  refetchInstrukturAsesor: () => void,
) => {
  const { setToaster } = useContext(ToasterContext);

  const deleteInstrukturAsesorById = async (id: string) => {
    const response =
      await kelolaInstrukturAsesorServices.deleteInstrukturOrAsesor(id);

    return response.data;
  };

  const {
    mutate: mutateDeleteInstrukturAsesor,
    isPending: isPendingDeleteInstrukturAsesor,
    isSuccess: isSuccessDeleteInstrukturAsesor,
    reset: resetDeleteInstrukturAsesor,
  } = useMutation({
    mutationFn: deleteInstrukturAsesorById,
    onError: (error) => {
      setToaster({
        title: "Gagal menghapus instruktur/asesor",
        type: "error",
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    },
    onSuccess: () => {
      setToaster({
        title: "Berhasil menghapus instruktur/asesor",
        type: "success",
        message: "Instruktur/Asesor berhasil dihapus",
      });
      refetchInstrukturAsesor(); // refetch data after delete successfully
    },
  });

  return {
    handleDeleteInstrukturAsesor: mutateDeleteInstrukturAsesor,
    isPendingDeleteInstrukturAsesor,
    isSuccessDeleteInstrukturAsesor,
    resetDeleteInstrukturAsesor,
  };
};

export default useDeleteInstrukturAsesorModal;
