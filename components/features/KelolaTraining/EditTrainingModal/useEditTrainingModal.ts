"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import { kelolaTrainingServices } from "@/services/kelolaTraining.services";
import { IKelolaTraining } from "@/types/kelolaTraining";
import useMediaHandling from "@/hooks/useMediaHandling";

const schema = yup.object().shape({
  namaTraining: yup.string().required("Nama training wajib diisi"),
  image: yup.string().required("Gambar training wajib diisi"),
  description: yup.string().required("Deskripsi training wajib diisi"),
});

const useEditTrainingModal = (id: string, isOpen: boolean) => {
  const { setToaster } = useContext(ToasterContext);
  const {
    mutateUploadFile,
    isPendingMutateDeleteFile,
    mutateDeleteFile,
    isPendingMutateUploadFile,
  } = useMediaHandling();

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
    watch: watchUpdateTraining,
    setValue: setValueUpdateTraining,
    getValues: getValuesUpdateTraining,
    reset: resetUpdateTraining,
  } = useForm({
    resolver: yupResolver(schema),
    values: trainingDataById
      ? {
          namaTraining: trainingDataById.data.namaTraining || "",
          description: trainingDataById.data.description || "",
          image: trainingDataById.data.image || "",
        }
      : undefined,
  });

  const preview = watchUpdateTraining("image");

  // all about media handling
  const handleUploadImage = (
    files: FileList,
    onChange: (file: FileList | undefined) => void,
  ) => {
    if (files.length !== 0) {
      onChange(files); // set the file to callback function to update the form state with the selected file
      mutateUploadFile({
        file: files[0],
        callback: (fileUrl: string) => {
          setValueUpdateTraining("image", fileUrl); // set value of image field in form state with the uploaded file url
        },
      });
    }
  };

  const handleDeleteImage = (
    onChange: (files: FileList | undefined) => void,
  ) => {
    const fileUrl = getValuesUpdateTraining("image"); // get the current file url from form state

    if (typeof fileUrl === "string") {
      mutateDeleteFile({
        fileUrl,
        callback: () => {
          onChange(undefined); // set the file to undefined to update the form state and remove the preview
        },
      });
    }
  };

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
    },
  });

  const handleOnClose = (onClose: () => void, isCancel: Boolean) => {
    const fileUrl = getValuesUpdateTraining("image");

    if (isCancel && typeof fileUrl === "string") {
      mutateDeleteFile({
        fileUrl,
        callback: () => {
          resetUpdateTraining(); // reset the form state to initial values
          onClose(); // call the onClose callback to close the modal
        },
      });
    } else {
      resetUpdateTraining(); // reset the form state to initial values
      onClose(); // call the onClose callback to close the modal
    }
  };

  const handleUpdateTraining = (data: Omit<IKelolaTraining, "id">) => {
    mutateEditTraining(data);
  };

  return {
    controlUpdateTraining,
    handleSubmitUpdateTraining,
    errorsUpdateTraining,
    handleOnClose,

    preview,
    handleUploadImage,
    isPendingMutateUploadFile,
    handleDeleteImage,
    isPendingMutateDeleteFile,

    trainingDataById,

    handleUpdateTraining,
    isPendingMutateUpdateTraining,
    isSuccessMutateUpdateTraining,
  };
};

export default useEditTrainingModal;
