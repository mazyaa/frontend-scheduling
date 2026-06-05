"use client";

import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { revisiServices } from "@/services/revisi.service";
import { ToasterContext } from "@/context/ToasterContext";

const schema = yup.object().shape({
  catatan: yup.string().required("Catatan revisi wajib diisi"),
});

export type IFormRevisi = yup.InferType<typeof schema>;

const useRevisiAsesorModal = (selectedId: string) => {
  const { setToaster } = useContext(ToasterContext);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormRevisi>({
    resolver: yupResolver(schema),
    defaultValues: {
      catatan: "",
    },
  });

  const uploadRevisi = async (payload: IFormRevisi) => {
    const formData = new FormData();

    formData.append("catatan", payload.catatan);
    if (fileToUpload) {
      formData.append("file", fileToUpload);
    }
    await revisiServices.uploadRevisiAdmin(selectedId, formData);
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

  const handleSubmitForm = (payload: IFormRevisi) => {
    if (!fileToUpload) {
      setToaster({
        title: "Gagal",
        type: "error",
        message: "File revisi wajib diupload",
      });

      return;
    }
    mutateRevisi(payload);
  };

  const handleOnClose = (onClose: () => void) => {
    reset();
    setFileToUpload(null);
    onClose();
  };

  return {
    control,
    errors,
    handleSubmitForm: handleSubmit(handleSubmitForm),
    isPendingMutateRevisi,
    isSuccessMutateRevisi,
    handleOnClose,
    fileToUpload,
    setFileToUpload,
  };
};

export default useRevisiAsesorModal;
