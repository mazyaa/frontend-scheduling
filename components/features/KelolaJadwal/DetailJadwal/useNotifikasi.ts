"use client";

import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import { notifyServices } from "@/services/notification.services";
import { INotify } from "@/types/notify";
import errorHandling from "@/utils/errrorHandling";

const useNotifikasi = () => {
  const { setToaster } = useContext(ToasterContext);

  const sendNotification = async (detailJadwalId: string) => {
    if (!detailJadwalId) {
      throw new Error("ID Detail Jadwal tidak ditemukan");
    }

    const response = await notifyServices.createNotification(detailJadwalId);

    // Destructure the response
    const notifyData = response.data as Partial<INotify>;
    const {
      generatedNotificationForInstruktur,
      generatedNotificationForAsesor,
    } = notifyData?.data || {};

    // Validation: Check if at least one notification URL is generated
    const hasInstrukturNotification =
      generatedNotificationForInstruktur &&
      generatedNotificationForInstruktur.trim() !== "";
    const hasAsesorNotification =
      generatedNotificationForAsesor &&
      generatedNotificationForAsesor.trim() !== "";

    if (!hasInstrukturNotification && !hasAsesorNotification) {
      throw new Error(
        "Gagal membuat notifikasi. Tidak ada instruktur atau asesor yang ditemukan.",
      );
    }

    // Open notification links in new tabs
    if (hasInstrukturNotification) {
      window.open(generatedNotificationForInstruktur, "_blank");
    }

    if (hasAsesorNotification) {
      window.open(generatedNotificationForAsesor, "_blank");
    }

    return response;
  };

  const {
    mutate: mutateKirimNotifikasi,
    isPending: isPendingKirimNotifikasi,
    isSuccess: isSuccessKirimNotifikasi,
  } = useMutation({
    mutationFn: sendNotification,
    onError: (error: any) => {
      const message = errorHandling(error);

      setToaster({
        title: "Gagal mengirim notifikasi",
        type: "error",
        message: message || "Gagal mengirim notifikasi. Silahkan coba lagi.",
      });
    },
    onSuccess: () => {
      setToaster({
        title: "Berhasil",
        type: "success",
        message: "Notifikasi berhasil dikirim",
      });
    },
  });

  const handleKirimNotifikasi = (detailJadwalId: string) => {
    mutateKirimNotifikasi(detailJadwalId);
  };

  return {
    handleKirimNotifikasi,
    isPendingKirimNotifikasi,
    isSuccessKirimNotifikasi,
  };
};

export default useNotifikasi;
