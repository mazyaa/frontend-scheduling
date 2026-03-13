import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import { kelolaInstrukturAsesorServices } from "@/services/kelolaInstrukturAsesor";
import { IKelolaInstrukturAsesor } from "@/types/kelolaInstrukturAsesor";

const schema = yup.object().shape({
  name: yup.string().required("Nama wajib diisi"),
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
    control,
    handleSubmit: handleSubmitForm,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

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
            ? error.message
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

  const handleOnClose = (onClose: () => void) => {
    onClose();
    reset();
  };

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

    handleOnClose,
  };
};

export default useTambahInstrukturAsesorModal;
