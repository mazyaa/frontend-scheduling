import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import { kelolaTrainingServices } from "@/services/kelolaTraining.services";
import { IKelolaTraining } from "@/types/kelolaTraining";
import useMediaHandling from "@/hooks/useMediaHandling";

const schema = yup.object().shape({
  namaTraining: yup.string().required("Nama training wajib diisi"),
  image: yup.string().required("Gambar training wajib diisi"),
  description: yup.string().required("Deskripsi training wajib diisi"),
});

const useTambahTrainingModal = () => {
  const { setToaster } = useContext(ToasterContext);
  const {
    mutateUploadFile,
    isPendingMutateDeleteFile,
    mutateDeleteFile,
    isPendingMutateUploadFile,
  } = useMediaHandling();

  // all about form handling
  const {
    control,
    handleSubmit: handleSubmitForm,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const preview = watch("image"); // watch the image field to get the selected file url for preview

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
          setValue("image", fileUrl); // set value of image field in form state with the uploaded file url
        },
      });
    }
  };

  const handleDeleteImage = (
    onChange: (files: FileList | undefined) => void,
  ) => {
    const fileUrl = getValues("image"); // get the current file url from form state

    if (typeof fileUrl === "string") {
      mutateDeleteFile({
        fileUrl,
        callback: () => {
          onChange(undefined); // set the file to undefined to update the form state and remove the preview
        },
      });
    }
  };

  const handleOnClose = (onClose: () => void) => {
    const fileUrl = getValues("image");

    if (typeof fileUrl === "string") {
      mutateDeleteFile({
        fileUrl,
        callback: () => {
          reset(); // reset the form state to initial values
          onClose(); // call the onClose callback to close the modal
        },
      });
    } else {
      reset(); // reset the form state to initial values
      onClose(); // call the onClose callback to close the modal
    }
  };

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

    preview,
    handleUploadImage,
    isPendingMutateUploadFile,
    handleDeleteImage,
    isPendingMutateDeleteFile,
    handleOnClose,
  };
};

export default useTambahTrainingModal;
