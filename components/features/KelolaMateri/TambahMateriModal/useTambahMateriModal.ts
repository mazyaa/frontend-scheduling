"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useContext } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { materiServices } from "@/services/materi.service";
import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import { kelolaDetailJadwalServices } from "@/services/kelolaDetailJadwal.service";
import { ToasterContext } from "@/context/ToasterContext";

const schema = yup.object().shape({
  jadwalTrainingId: yup.string().required("Jadwal Training wajib dipilih"),
  detailJadwalTrainingId: yup.string().required("Detail Hari Training wajib dipilih"),
  judul: yup.string().required("Judul wajib diisi"),
});

export type IFormTambahMateri = yup.InferType<typeof schema>;

const useTambahMateriModal = () => {
  const { setToaster } = useContext(ToasterContext);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<IFormTambahMateri>({
    resolver: yupResolver(schema),
    defaultValues: {
      jadwalTrainingId: "",
      detailJadwalTrainingId: "",
      judul: "",
    },
  });

  const selectedJadwalTrainingId = watch("jadwalTrainingId");

  const { data: dataJadwalTraining, isLoading: isLoadingJadwalTraining } = useQuery({
    queryKey: ["JadwalTrainingOptions"],
    queryFn: async () => {
      const response = await kelolaJadwalServices.getAllSchedules("limit=100");
      return response.data.data;
    },
  });

  const { data: dataDetailJadwal, isLoading: isLoadingDetailJadwal } = useQuery({
    queryKey: ["DetailJadwalOptions", selectedJadwalTrainingId],
    queryFn: async () => {
      const response = await kelolaDetailJadwalServices.getAllDetailJadwal(selectedJadwalTrainingId, "limit=100");
      return response.data.data;
    },
    enabled: !!selectedJadwalTrainingId,
  });

  const uploadFile = async (payload: IFormTambahMateri) => {
    const formData = new FormData();
    formData.append("detailJadwalTrainingId", payload.detailJadwalTrainingId);
    formData.append("judul", payload.judul);
    if (fileToUpload) {
      formData.append("file", fileToUpload);
    }
    await materiServices.createMateri(formData);
  };

  const {
    mutate: mutateTambahMateri,
    isPending: isPendingMutateTambahMateri,
    isSuccess: isSuccessMutateTambahMateri,
  } = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      setToaster({
        title: "Berhasil",
        type: "success",
        message: "Materi berhasil ditambahkan",
      });
    },
    onError: (error) => {
      setToaster({
        title: "Gagal",
        type: "error",
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    },
  });

  const handleSubmitForm = (payload: IFormTambahMateri) => {
    mutateTambahMateri(payload);
  };

  const handleOnClose = (onClose: () => void) => {
    reset();
    setFileToUpload(null);
    onClose();
  };

  return {
    control,
    errors,
    handleSubmitForm: handleSubmit(handleSubmitForm),
    isPendingMutateTambahMateri,
    isSuccessMutateTambahMateri,
    handleOnClose,
    dataJadwalTraining,
    isLoadingJadwalTraining,
    dataDetailJadwal,
    isLoadingDetailJadwal,
    fileToUpload,
    setFileToUpload,
    setValue,
  };
};

export default useTambahMateriModal;
