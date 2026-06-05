"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { assesmentServices } from "@/services/assesment.service";
import { participantServices } from "@/services/participant.service";
import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import { ToasterContext } from "@/context/ToasterContext";

const schema = yup.object().shape({
  jadwalTrainingId: yup.string().required("Jadwal Training wajib dipilih"),
  userId: yup.string().required("Peserta wajib dipilih"),
  statusKompetensi: yup
    .string()
    .oneOf(["kompeten", "belum_kompeten"], "Status tidak valid")
    .required("Status Kompetensi wajib dipilih"),
  catatan: yup.string().optional(),
});

export type IFormTambahPenilaian = yup.InferType<typeof schema>;

const useTambahPenilaianModal = () => {
  const { setToaster } = useContext(ToasterContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<IFormTambahPenilaian>({
    resolver: yupResolver(schema),
    defaultValues: {
      jadwalTrainingId: "",
      userId: "",
      statusKompetensi: undefined,
      catatan: "",
    },
  });

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

  const { data: dataPeserta, isLoading: isLoadingPeserta } = useQuery({
    queryKey: ["PesertaOptions", selectedJadwalTrainingId],
    queryFn: async () => {
      if (!selectedJadwalTrainingId) return [];
      const response = await participantServices.getParticipantBySchedule(
        selectedJadwalTrainingId,
      );

      return response.data.results ?? response.data.data ?? response.data;
    },
    enabled: !!selectedJadwalTrainingId,
  });

  const createPenilaian = async (payload: IFormTambahPenilaian) => {
    await assesmentServices.createAssesment({
      userId: payload.userId,
      jadwalTrainingId: payload.jadwalTrainingId,
      statusKompetensi: payload.statusKompetensi as
        | "kompeten"
        | "belum_kompeten",
      catatan: payload.catatan || "",
    });
  };

  const {
    mutate: mutateTambahPenilaian,
    isPending: isPendingMutateTambahPenilaian,
    isSuccess: isSuccessMutateTambahPenilaian,
  } = useMutation({
    mutationFn: createPenilaian,
    onSuccess: () => {
      setToaster({
        title: "Berhasil",
        type: "success",
        message: "Penilaian berhasil ditambahkan",
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

  const handleSubmitForm = (payload: IFormTambahPenilaian) => {
    mutateTambahPenilaian(payload);
  };

  const handleOnClose = (onClose: () => void) => {
    reset();
    onClose();
  };

  return {
    control,
    errors,
    handleSubmitForm: handleSubmit(handleSubmitForm),
    isPendingMutateTambahPenilaian,
    isSuccessMutateTambahPenilaian,
    handleOnClose,
    dataJadwalTraining,
    isLoadingJadwalTraining,
    dataPeserta,
    isLoadingPeserta,
    setValue,
  };
};

export default useTambahPenilaianModal;
