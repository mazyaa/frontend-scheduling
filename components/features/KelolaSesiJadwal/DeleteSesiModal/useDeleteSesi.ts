import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";

import { kelolaSesiJadwalServices } from "@/services/kelolaSesiJadwal";
import { ToasterContext } from "@/context/ToasterContext";
import errorHandling from "@/utils/errrorHandling";

interface Props {
  selectedId: string;
  refetchSesiJadwal: () => void;
  onOpenChange: () => void;
}

const useDeleteSesi = ({
  selectedId,
  refetchSesiJadwal,
  onOpenChange,
}: Props) => {
  const { setToaster } = useContext(ToasterContext);

  const { mutate: handleDeleteSesi, isPending } = useMutation({
    mutationFn: async () => {
      const res =
        await kelolaSesiJadwalServices.deleteSessionSchedule(selectedId);

      return res.data;
    },
    onSuccess: () => {
      setToaster({
        title: "Berhasil",
        type: "success",
        message: "Berhasil menghapus sesi jadwal",
      });
      refetchSesiJadwal();
      onOpenChange();
    },
    onError: (error: any) => {
      const message = errorHandling(error);

      setToaster({
        title: "Gagal menghapus sesi",
        type: "error",
        message: message || "Gagal menghapus sesi jadwal",
      });
    },
  });

  return { handleDeleteSesi, isPending };
};

export default useDeleteSesi;
