"use client";

import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";

import { revisiServices } from "@/services/revisi.service";
import { ToasterContext } from "@/context/ToasterContext";

const useRevisiAdminModal = (selectedPenilaianId: string) => {
  const { setToaster } = useContext(ToasterContext);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const uploadRevisi = async () => {
    if (!fileToUpload) {
      throw new Error("File revisi wajib diupload");
    }

    const formData = new FormData();

    formData.append("file", fileToUpload);
    await revisiServices.uploadRevisiAdmin(selectedPenilaianId, formData);
  };

  const {
    mutate: mutateRevisi,
    isPending: isPendingMutateRevisi,
    isSuccess: isSuccessMutateRevisi,
  } = useMutation({
    mutationFn: uploadRevisi,
    onSuccess: () => {
      setToaster({
        title: "Berhasil",
        type: "success",
        message: "File revisi berhasil diupload",
      });
    },
    onError: (error) => {
      setToaster({
        title: "Gagal",
        type: "error",
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    },
  });

  return {
    mutateRevisi,
    isPendingMutateRevisi,
    isSuccessMutateRevisi,
    fileToUpload,
    setFileToUpload,
  };
};

export default useRevisiAdminModal;
