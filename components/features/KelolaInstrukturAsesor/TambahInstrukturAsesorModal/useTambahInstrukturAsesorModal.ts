import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";

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

const useTambahInstrukturAsesorModal = () => {
  const { setToaster } = useContext(ToasterContext);
  const {
    mutateUploadFile,
    isPendingMutateDeleteFile,
    mutateDeleteFile,
    isPendingMutateUploadFile,
  } = useMediaHandling();

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

  const tambahInstrukturAsesor = async (
    payload: Omit<IKelolaInstrukturAsesor, "id">,
  ) => {
    const response =
      await kelolaInstrukturAsesorServices.addInstrukturOrAsesor(payload);

    return response;
  };

  const {
    mutate: mutateAddInstrukturAsesor,
    isPending: isPendingMutateAddInstrukturAsesor,
    isSuccess: isSuccessMutateAddInstrukturAsesor,
  } = useMutation({
    mutationFn: tambahInstrukturAsesor,
    onError: (error) => {
      setToaster({
        title: "Tambah Instruktur/Asesor Gagal",
        type: "error",
        message:
          error instanceof Error
            ? error?.message
            : "Terjadi kesalahan saat menambahkan instruktur/asesor",
      });
    },
    onSuccess: () => {
      setToaster({
        title: "Tambah Instruktur/Asesor Berhasil",
        type: "success",
        message: "Instruktur/Asesor berhasil ditambahkan",
      });
      reset();
    },
  });

  const handleAddInstrukturAsesor = (
    data: Omit<IKelolaInstrukturAsesor, "id">,
  ) => {
    mutateAddInstrukturAsesor(data);
  };

  return {
    control,
    errors,
    handleSubmitForm,
    handleAddInstrukturAsesor,
    isPendingMutateAddInstrukturAsesor,
    isSuccessMutateAddInstrukturAsesor,

    preview,

    handleUploadImage,
    handleDeleteImage,
    isPendingMutateUploadFile,
    isPendingMutateDeleteFile,
    handleOnClose,
  };
};

export default useTambahInstrukturAsesorModal;
