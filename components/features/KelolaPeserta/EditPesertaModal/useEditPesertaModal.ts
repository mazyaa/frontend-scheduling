import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import { participantServices } from "@/services/participant.service";
import { IParticipant } from "@/types/participant";
import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import errorHandling from "@/utils/errrorHandling";

const schema = yup.object().shape({
  name: yup.string().required("Nama wajib diisi"),
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  noWa: yup.string().required("Nomor WA wajib diisi"),
  instansi: yup.string().nullable(),
  jadwalTrainingId: yup.string().nullable(),
});

const useEditPesertaModal = (selectedData: IParticipant | null) => {
  const { setToaster } = useContext(ToasterContext);

  const {
    control,
    handleSubmit: handleSubmitForm,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      noWa: "",
      instansi: "",
      jadwalTrainingId: "",
    },
  });

  useEffect(() => {
    if (selectedData) {
      setValue("name", selectedData.name || "");
      setValue("email", selectedData.email || "");
      setValue("noWa", selectedData.noWa || "");
      setValue("instansi", selectedData.instansi || "");
      setValue("jadwalTrainingId", selectedData.jadwalTrainingId || "");
    }
  }, [selectedData, setValue]);

  const { data: scheduleData, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ["DropdownJadwalPesertaEdit"],
    queryFn: async () => {
      const response =
        await kelolaJadwalServices.getAllSchedules("limit=100&page=1");

      return response.data.data;
    },
  });

  const {
    mutate: handleEditPeserta,
    isPending: isPendingMutateEditPeserta,
    isSuccess: isSuccessMutateEditPeserta,
  } = useMutation({
    mutationFn: async (payload: Partial<IParticipant>) => {
      if (!selectedData?.id) throw new Error("ID Peserta tidak ditemukan");

      return await participantServices.updateParticipant(
        selectedData.id,
        payload,
      );
    },
    onSuccess: () => {
      setToaster({
        type: "success",
        title: "Berhasil",
        message: "Berhasil mengubah data",
      });
      reset();
    },
    onError: (error) => {
      setToaster({
        type: "error",
        title: "Gagal",
        message: errorHandling(error),
      });
    },
  });

  return {
    control,
    errors,
    handleSubmitForm,
    handleEditPeserta,
    isPendingMutateEditPeserta,
    isSuccessMutateEditPeserta,
    scheduleData,
    isLoadingSchedules,
    reset,
  };
};

export default useEditPesertaModal;
