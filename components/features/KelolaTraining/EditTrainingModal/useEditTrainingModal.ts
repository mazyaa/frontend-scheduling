"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import { kelolaTrainingServices } from "@/services/kelolaTraining.services";
import { IKelolaTraining } from "@/types/kelolaTraining";

const schema = yup.object().shape({
  namaTraining: yup.string().required("Nama training wajib diisi"),
  description: yup.string().required("Deskripsi training wajib diisi"),
});

const useEditTrainingModal = (
  id: string,
  refetchTraining: () => void,
  isOpen: boolean,
) => {
  const { setToaster } = useContext(ToasterContext);

  const getTrainingById = async (id: string) => {
    const response = await kelolaTrainingServices.getTrainingById(id);

    return response.data;
  };

  const { data: trainingDataById } = useQuery({
    queryKey: ["training", id],
    queryFn: () => getTrainingById(id),
    enabled: !!id && isOpen, // only run this query if id is not empty, because when id is empty, it means user haven't click edit button, so we don't need to fetch training data
  });

  const {
    control: controlUpdateTraining,
    handleSubmit: handleSubmitUpdateTraining,
    formState: { errors: errorsUpdateTraining },
    reset: resetUpdateTraining,
  } = useForm({
    resolver: yupResolver(schema),
    values: trainingDataById
      ? {
          namaTraining: trainingDataById.data.namaTraining || "",
          description: trainingDataById.data.description || "",
        }
      : undefined,
  });

  const editTraining = async (
    id: string,
    payload: Omit<IKelolaTraining, "id">,
  ) => {
    const response = await kelolaTrainingServices.updateTraining(id, payload);

    return response;
  };

  const {
    mutate: mutateEditTraining,
    isPending: isPendingMutateUpdateTraining,
    isSuccess: isSuccessMutateUpdateTraining,
  } = useMutation({
    // id not needed in payload because it's already passed as argument in mutationFn, and in service function, id is passed as argument in url param, not in payload
    mutationFn: (payload: Omit<IKelolaTraining, "id">) =>
      editTraining(id, payload),
    onError: (error) => {
      setToaster({
        title: "Edit Training Gagal",
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengedit training",
      });
    },
    onSuccess: () => {
      setToaster({
        title: "Edit Training Berhasil",
        type: "success",
        message: "Training berhasil diedit",
      });
      resetUpdateTraining();
      refetchTraining();
    },
  });

  const handleOnClose = (onClose: () => void) => {
    onClose();
    resetUpdateTraining();
  };

  const handleUpdateTraining = (data: Omit<IKelolaTraining, "id">) => {
    mutateEditTraining(data);
  };

  return {
    controlUpdateTraining,
    handleSubmitUpdateTraining,
    errorsUpdateTraining,
    handleOnClose,

    trainingDataById,

    handleUpdateTraining,
    isPendingMutateUpdateTraining,
    isSuccessMutateUpdateTraining,
  };
};

export default useEditTrainingModal;
