"use client";

import { useContext } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { ToasterContext } from "@/context/ToasterContext";
import { IKelolaJadwal } from "@/types/kelolaJadwal";
import { kelolaJadwalServices } from "@/services/kelolaJadwal.constants";

const schema = yup.object().shape({
  trainingId: yup.string().required("Pelatihan wajib diisi!"),
  startDate: yup
    .date()
    .required("Tanggal mulai wajib diisi!")
    .typeError("Tanggal mulai wajib diisi!"),
  duration: yup.number().required("Durasi wajib diisi!"),
  meetingLink: yup.string().required("Link meeting wajib diisi!"),
  batch: yup.string().required("Batch wajib diisi!"),
});

const useTambahJadwal = () => {
  const { setToaster } = useContext(ToasterContext);

  const {
    control,
    handleSubmit: handleSubmitForm,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const tambahJadwal = async (payload: Omit<IKelolaJadwal, "id">) => {
    const response = await kelolaJadwalServices.addSchedule(payload);

    return response;
  };

  const {
    mutate: mutateTambahJadwal,
    isPending: isPendingMutateTambahJadwal,
    isSuccess: isSuccessMutateTambahJadwal,
  } = useMutation({
    mutationFn: tambahJadwal,
    onError: (error) => {
      let message = "Terjadi kesalahan saat menambahkan jadwal training";

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      setToaster({
        title: "Gagal menambahkan jadwal training",
        type: "error",
        message,
      });
    },
    onSuccess: () => {
      setToaster({
        title: "Berhasil menambahkan jadwal training",
        type: "success",
        message: "Jadwal training berhasil ditambahkan",
      });
      reset();
    },
  });

  const handleOnClose = (onClose: () => void) => {
    onClose();
    reset();
  };

  const handleTambahJadwal = (data: Omit<IKelolaJadwal, "id">) => {
    mutateTambahJadwal(data);
  };

  return {
    control,
    errors,
    handleSubmitForm,
    handleTambahJadwal,
    isPendingMutateTambahJadwal,
    isSuccessMutateTambahJadwal,

    handleOnClose,
  };
};

export default useTambahJadwal;
