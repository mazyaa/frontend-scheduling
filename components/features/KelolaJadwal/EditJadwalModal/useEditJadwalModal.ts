import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";

import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import { ToasterContext } from "@/context/ToasterContext";
import { IKelolaJadwal } from "@/types/kelolaJadwal";
import errorHandling from "@/utils/errrorHandling";

const schema = yup.object().shape({
  trainingId: yup.string().required("Pelatihan wajib diisi!"),
  startDate: yup
    .string()
    .required("Tanggal mulai wajib diisi!")
    .typeError("Tanggal mulai wajib diisi!"),
  duration: yup.number().required("Durasi wajib diisi!"),
  meetingLink: yup.string().required("Link meeting wajib diisi!"),
  batch: yup.string().required("Batch wajib diisi!"),
});

const useEditJadwalModal = (id: string, isOpen: boolean) => {
  const { setToaster } = useContext(ToasterContext);

  const getJadwalTrainingById = async (id: string) => {
    const response = await kelolaJadwalServices.getScheduleById(id);

    return response.data;
  };

  const { data: jadwalTrainingDataById } = useQuery({
    queryKey: ["jadwalTraining", id],
    queryFn: () => getJadwalTrainingById(id),
    enabled: !!id && isOpen,
  });

  const {
    control: controlUpdateJadwalTraining,
    handleSubmit: handleSubmitUpdateJadwalTraining,
    formState: { errors: errorsUpdateJadwalTraining },
    reset: resetUpdateJadwalTraining,
  } = useForm({
    resolver: yupResolver(schema),
    values: jadwalTrainingDataById
      ? {
          trainingId: jadwalTrainingDataById.data.trainingId,
          startDate: jadwalTrainingDataById.data.startDate.split("T")[0],
          duration: jadwalTrainingDataById.data.duration,
          meetingLink: jadwalTrainingDataById.data.meetingLink,
          batch: jadwalTrainingDataById.data.batch,
        }
      : undefined,
  });

  const handleOnClose = (onClose: () => void) => {
    onClose();
    resetUpdateJadwalTraining();
  };

  const editJadwalTraining = async (
    id: string,
    payload: Omit<IKelolaJadwal, "id">,
  ) => {
    const response = await kelolaJadwalServices.updateSchedule(id, payload);

    return response;
  };

  const {
    mutate: mutateEditJadwalTraining,
    isPending: isPendingEditJadwalTraining,
    isSuccess: isSuccessEditJadwalTraining,
  } = useMutation({
    mutationFn: (payload: Omit<IKelolaJadwal, "id">) =>
      editJadwalTraining(id, payload),
    onError: (error) => {
      const message = errorHandling(error);

      setToaster({
        title: "Edit Jadwal Training Gagal",
        type: "error",
        message:
          message || "Terjadi kesalahan dalam mengubah data jadwal training",
      });
    },
    onSuccess: () => {
      setToaster({
        title: "Edit Jadwal Training Berhasil",
        type: "success",
        message: "Jadwal training berhasil diubah",
      });
    },
  });

  const handleUpdateJadwalTraining = (payload: Omit<IKelolaJadwal, "id">) =>
    mutateEditJadwalTraining(payload);

  return {
    controlUpdateJadwalTraining,
    handleSubmitUpdateJadwalTraining,
    errorsUpdateJadwalTraining,
    resetUpdateJadwalTraining,

    jadwalTrainingDataById,
    handleOnClose,

    handleUpdateJadwalTraining,
    isPendingEditJadwalTraining,
    isSuccessEditJadwalTraining,
  };
};

export default useEditJadwalModal;
