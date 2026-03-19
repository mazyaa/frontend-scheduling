"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import { kelolaInstrukturAsesorServices } from "@/services/kelolaInstrukturAsesor";
import { IKelolaInstrukturAsesor } from "@/types/kelolaInstrukturAsesor";
import useMediaHandling from "@/hooks/useMediaHandling";

const schema = yup.object().shape({
  name: yup.string().required("Nama wajib diisi"),
  image: yup.string().required("Gambar wajib diisi"),
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  noWa: yup.string().required("Nomor WA wajib diisi"),
  role: yup
    .string()
    .oneOf(["instruktur", "asesor"], "Role harus instruktur atau asesor")
    .required("Role wajib diisi"),
  keahlian: yup.string().required("Keahlian wajib diisi"),
});

const useEditInstrukturAsesorModal = (id: string, isOpen: boolean) => {
  const { setToaster } = useContext(ToasterContext);
  const {
    mutateUploadFile,
    isPendingMutateDeleteFile,
    mutateDeleteFile,
    isPendingMutateUploadFile,
  } = useMediaHandling();

  const getInstrukturAsesorById = async (id: string) => {
    const response =
      await kelolaInstrukturAsesorServices.getInstrukturOrAsesorById(id);

    return response.data;
  };

  const { data: instrukturAsesorDataById } = useQuery({
    queryKey: ["instrukturAsesor", id],
    queryFn: () => getInstrukturAsesorById(id),
    enabled: !!id && isOpen, // only run this query if id is not empty, because when id is empty, it means user haven't click edit button, so we don't need to fetch data
  });

  const {
    control: controlUpdateInstrukturAsesor,
    handleSubmit: handleSubmitUpdateInstrukturAsesor,
    formState: { errors: errorsUpdateInstrukturAsesor },
    reset: resetUpdateInstrukturAsesor,
    watch: watchUpdateInstrukturAsesor,
    setValue: setValueUpdateInstrukturAsesor,
    getValues: getValuesUpdateInstrukturAsesor,
  } = useForm({
    resolver: yupResolver(schema),
    values: instrukturAsesorDataById
      ? {
          name: instrukturAsesorDataById.data.name || "",
          image: instrukturAsesorDataById.data.image || "",
          email: instrukturAsesorDataById.data.email || "",
          noWa: instrukturAsesorDataById.data.noWa || "",
          role: instrukturAsesorDataById.data.role || "",
          keahlian: instrukturAsesorDataById.data.keahlian || "",
        }
      : undefined,
  });

  const preview = watchUpdateInstrukturAsesor("image"); // watch the image field to get the selected file url for preview

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
          setValueUpdateInstrukturAsesor("image", fileUrl); // set value of image field in form state with the uploaded file url
        },
      });
    }
  };

  const handleDeleteImage = (
    onChange: (files: FileList | undefined) => void,
  ) => {
    const fileUrl = getValuesUpdateInstrukturAsesor("image"); // get the current file url from form state

    if (typeof fileUrl === "string") {
      mutateDeleteFile({
        fileUrl,
        callback: () => {
          onChange(undefined); // set the file to undefined to update the form state and remove the preview
        },
      });
    }
  };

  const handleOnClose = (onClose: () => void, isCancel: Boolean) => {
    const fileUrl = getValuesUpdateInstrukturAsesor("image");

    if (isCancel && typeof fileUrl === "string") {
      mutateDeleteFile({
        fileUrl,
        callback: () => {
          resetUpdateInstrukturAsesor(); // reset the form state to initial values
          onClose(); // call the onClose callback to close the modal
        },
      });
    } else {
      resetUpdateInstrukturAsesor(); // reset the form state to initial values
      onClose(); // call the onClose callback to close the modal
    }
  };

  const editInstrukturAsesor = async (
    id: string,
    payload: Omit<IKelolaInstrukturAsesor, "id">,
  ) => {
    const response =
      await kelolaInstrukturAsesorServices.updateInstrukturOrAsesor(
        id,
        payload,
      );

    return response;
  };

  const {
    mutate: mutateEditInstrukturAsesor,
    isPending: isPendingMutateUpdateInstrukturAsesor,
    isSuccess: isSuccessMutateUpdateInstrukturAsesor,
  } = useMutation({
    // id not needed in payload because it's already passed as argument in mutationFn, and in service function, id is passed as argument in url param, not in payload
    mutationFn: (payload: Omit<IKelolaInstrukturAsesor, "id">) =>
      editInstrukturAsesor(id, payload),
    onError: (error) => {
      setToaster({
        title: "Edit Instruktur/Asesor Gagal",
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengedit instruktur/asesor",
      });
    },
    onSuccess: () => {
      setToaster({
        title: "Edit Instruktur/Asesor Berhasil",
        type: "success",
        message: "Instruktur/Asesor berhasil diedit",
      });
      resetUpdateInstrukturAsesor();
    },
  });

  const handleUpdateInstrukturAsesor = (
    data: Omit<IKelolaInstrukturAsesor, "id">,
  ) => {
    mutateEditInstrukturAsesor(data);
  };

  return {
    controlUpdateInstrukturAsesor,
    handleSubmitUpdateInstrukturAsesor,
    errorsUpdateInstrukturAsesor,

    preview,

    handleUploadImage,
    handleDeleteImage,
    isPendingMutateUploadFile,
    isPendingMutateDeleteFile,
    handleOnClose,

    instrukturAsesorDataById,

    handleUpdateInstrukturAsesor,
    isPendingMutateUpdateInstrukturAsesor,
    isSuccessMutateUpdateInstrukturAsesor,
  };
};

export default useEditInstrukturAsesorModal;
