import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useContext } from "react";

import { kelolaSesiJadwalServices } from "@/services/kelolaSesiJadwal";
import { ToasterContext } from "@/context/ToasterContext";
import errorHandling from "@/utils/errrorHandling";

const useGenerateSesiOtomatis = () => {
  const router = useRouter();
  const params = useParams();
  const jadwalId = params.id as string;
  const { setToaster } = useContext(ToasterContext);

  const {
    mutate: handleGenerateSesiOtomatis,
    isPending: isPendingGenerateSesi,
  } = useMutation({
    mutationFn: async (detailJadwalId: string) => {
      const response =
        await kelolaSesiJadwalServices.createMultipleSessionSchedule(
          detailJadwalId,
        );

      return { data: response.data, detailJadwalId };
    },
    onSuccess: ({ detailJadwalId }) => {
      setToaster({
        title: "Berhasil",
        type: "success",
        message: "Halaman Sesi Akan Ditampilkan",
      });
      router.push(
        `/admin/kelola-jadwal-training/${jadwalId}/sesi/${detailJadwalId}`,
      );
    },
    onError: (error: any) => {
      const message = errorHandling(error);

      setToaster({
        title: "Gagal generate sesi otomatis",
        type: "error",
        message: message || "Gagal generate sesi otomatis. Silahkan coba lagi.",
      });
    },
  });

  return { handleGenerateSesiOtomatis, isPendingGenerateSesi };
};

export default useGenerateSesiOtomatis;
