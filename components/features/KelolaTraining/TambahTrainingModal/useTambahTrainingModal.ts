import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import { kelolaTrainingServices } from "@/services/kelolaTraining.services";
import { IKelolaTraining } from "@/types/kelolaTraining";

const schema = yup.object().shape({
  namaTraining: yup.string().required("Nama training wajib diisi"),
  description: yup.string().required("Deskripsi training wajib diisi"),
});

const useTambahTrainingModal = () => {
  const { setToaster } = useContext(ToasterContext);

  const {
    control,
    handleSubmit: handleSubmitForm,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const tambahTraining = async (payload: Omit<IKelolaTraining, "id">) => {
    const response = await kelolaTrainingServices.addTraining(payload);

    return response;
  };

  const {
    mutate: mutateAddTraining,
    isPending: isPendingMutateAddTraining,
    isSuccess: isSuccessMutateAddTraining,
  } = useMutation({
    mutationFn: tambahTraining,
    onError: (error) => {
      setToaster({
        title: "Tambah Training Gagal",
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menambahkan training",
      });
    },
    onSuccess: () => {
      setToaster({
        title: "Tambah Training Berhasil",
        type: "success",
        message: "Training berhasil ditambahkan",
      });
      reset();
    },
  });

  const handleOnClose = (onClose: () => void) => {
    onClose();
    reset();
  };

  const handleAddTraining = (data: Omit<IKelolaTraining, "id">) => {
    mutateAddTraining(data);
  };

  return {
    control,
    errors,
    handleSubmitForm,
    handleAddTraining,
    isPendingMutateAddTraining,
    isSuccessMutateAddTraining,

    handleOnClose,
  };
};

export default useTambahTrainingModal;
