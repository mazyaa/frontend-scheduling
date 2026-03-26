"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";

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

const useEditInstrukturAsesorModal = (
  id: string,
  refetchInstrukturAsesor: () => void,
  isOpen: boolean,
) => {
  const { setToaster } = useContext(ToasterContext);

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
  } = useForm({
    resolver: yupResolver(schema),
    values: instrukturAsesorDataById
      ? {
          name: instrukturAsesorDataById.data.name || "",
          email: instrukturAsesorDataById.data.email || "",
          noWa: instrukturAsesorDataById.data.noWa || "",
          role: instrukturAsesorDataById.data.role || "",
          keahlian: instrukturAsesorDataById.data.keahlian || "",
        }
      : undefined,
  });

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
      refetchInstrukturAsesor();
    },
  });

  const handleOnClose = (onClose: () => void) => {
    onClose();
    resetUpdateInstrukturAsesor();
  };

  const handleUpdateInstrukturAsesor = (
    data: Omit<IKelolaInstrukturAsesor, "id">,
  ) => {
    mutateEditInstrukturAsesor(data);
  };

  return {
    controlUpdateInstrukturAsesor,
    handleSubmitUpdateInstrukturAsesor,
    errorsUpdateInstrukturAsesor,
    handleOnClose,

    instrukturAsesorDataById,

    handleUpdateInstrukturAsesor,
    isPendingMutateUpdateInstrukturAsesor,
    isSuccessMutateUpdateInstrukturAsesor,
  };
};

export default useEditInstrukturAsesorModal;
