import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import { participantServices } from "@/services/participant.service";
import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import { IParticipant } from "@/types/participant";
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

const useTambahPesertaModal = () => {
  const { setToaster } = useContext(ToasterContext);

  const {
    control,
    handleSubmit: handleSubmitForm,
    formState: { errors },
    reset,
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

  const { data: scheduleData, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ["DropdownJadwalPeserta"],
    queryFn: async () => {
      const response =
        await kelolaJadwalServices.getAllSchedules("limit=100&page=1");

      return response.data.data;
    },
  });

  const {
    mutate: handleAddPeserta,
    isPending: isPendingMutateAddPeserta,
    isSuccess: isSuccessMutateAddPeserta,
  } = useMutation({
    mutationFn: async (payload: Omit<IParticipant, "id">) => {
      return await participantServices.createParticipant(payload);
    },
    onSuccess: () => {
      setToaster({
        type: "success",
        title: "Berhasil",
        message: "Berhasil menambahkan data",
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
    handleAddPeserta,
    isPendingMutateAddPeserta,
    isSuccessMutateAddPeserta,
    scheduleData,
    isLoadingSchedules,
    reset,
  };
};

export default useTambahPesertaModal;
