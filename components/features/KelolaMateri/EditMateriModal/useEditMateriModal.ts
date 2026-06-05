"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useContext, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { materiServices } from "@/services/materi.service";
import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import { kelolaDetailJadwalServices } from "@/services/kelolaDetailJadwal.service";
import { ToasterContext } from "@/context/ToasterContext";

const schema = yup.object().shape({
  jadwalTrainingId: yup.string().required("Jadwal Training wajib dipilih"),
  detailJadwalTrainingId: yup
    .string()
    .required("Detail Hari Training wajib dipilih"),
  judul: yup.string().required("Judul wajib diisi"),
});

export type IFormEditMateri = yup.InferType<typeof schema>;

const useEditMateriModal = (selectedId: string, currentData: any[]) => {
  const { setToaster } = useContext(ToasterContext);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<IFormEditMateri>({
    resolver: yupResolver(schema),
    defaultValues: {
      jadwalTrainingId: "",
      detailJadwalTrainingId: "",
      judul: "",
    },
  });

  // Fetch data materi by ID untuk mendapatkan data lengkap
  const { data: materiDetail, isLoading: isLoadingMateriDetail } = useQuery({
    queryKey: ["MateriDetail", selectedId],
    queryFn: async () => {
      const response = await materiServices.getMateriById(selectedId);

      return response.data.data;
    },
    enabled: !!selectedId,
  });

  // Pre-fill form ketika data materi sudah di-fetch
  useEffect(() => {
    if (materiDetail) {
      setValue("judul", materiDetail.judul || "");
      setValue("jadwalTrainingId", materiDetail.jadwalTrainingId || "");
      setValue(
        "detailJadwalTrainingId",
        materiDetail.detailJadwalTrainingId || "",
      );
    }
  }, [materiDetail, setValue]);

  const selectedJadwalTrainingId = watch("jadwalTrainingId");

  const { data: dataJadwalTraining, isLoading: isLoadingJadwalTraining } =
    useQuery({
      queryKey: ["JadwalTrainingOptions"],
      queryFn: async () => {
        const response =
          await kelolaJadwalServices.getAllSchedules("limit=100");

        return response.data.data;
      },
    });

  const { data: dataDetailJadwal, isLoading: isLoadingDetailJadwal } = useQuery(
    {
      queryKey: ["DetailJadwalOptions", selectedJadwalTrainingId],
      queryFn: async () => {
        const response = await kelolaDetailJadwalServices.getAllDetailJadwal(
          selectedJadwalTrainingId,
          "limit=100",
        );

        return response.data.data;
      },
      enabled: !!selectedJadwalTrainingId,
    },
  );

  const uploadFile = async (payload: IFormEditMateri) => {
    const formData = new FormData();

    formData.append("detailJadwalTrainingId", payload.detailJadwalTrainingId);
    formData.append("judul", payload.judul);
    if (fileToUpload) {
      formData.append("file", fileToUpload);
    }
    await materiServices.updateMateri(selectedId, formData);
  };

  const {
    mutate: mutateEditMateri,
    isPending: isPendingMutateEditMateri,
    isSuccess: isSuccessMutateEditMateri,
  } = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      setToaster({
        title: "Berhasil",
        type: "success",
        message: "Materi berhasil diubah",
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

  const handleSubmitForm = (payload: IFormEditMateri) => {
    mutateEditMateri(payload);
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
    isPendingMutateEditMateri,
    isSuccessMutateEditMateri,
    handleOnClose,
    dataJadwalTraining,
    isLoadingJadwalTraining,
    dataDetailJadwal,
    isLoadingDetailJadwal,
    fileToUpload,
    setFileToUpload,
    setValue,
    isLoadingMateriDetail,
  };
};

export default useEditMateriModal;
