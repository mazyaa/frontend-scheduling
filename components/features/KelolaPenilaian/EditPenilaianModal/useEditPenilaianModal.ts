"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

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

export type IFormEditPenilaian = yup.InferType<typeof schema>;

const useEditPenilaianModal = (selectedId: string, currentData: any[]) => {
  const { setToaster } = useContext(ToasterContext);
  const { data: session } = useSession();
  const role = session?.user?.role;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<IFormEditPenilaian>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      jadwalTrainingId: "",
      userId: "",
      statusKompetensi: undefined,
      catatan: "",
    },
  });

  const selectedJadwalTrainingId = watch("jadwalTrainingId");

  const { data: dataPenilaianDetail, isLoading: isLoadingPenilaianDetail } =
    useQuery({
      queryKey: ["PenilaianDetail", selectedId],
      queryFn: async () => {
        const response = await assesmentServices.getAssesmentById(selectedId);

        return response.data.data;
      },
      enabled: !!selectedId,
    });

  const { data: dataJadwalTraining, isLoading: isLoadingJadwalTraining } =
    useQuery({
      queryKey: ["JadwalTrainingOptions", role],
      queryFn: async () => {
        if (role === "asesor") {
          const response = await kelolaJadwalServices.getMySchedules();

          return (response.data.data || []).map((item: any) => ({
            id: item.value,
            _displayLabel: item.label,
          }));
        }

        const response =
          await kelolaJadwalServices.getAllSchedules("limit=100");

        return response.data.data;
      },
      enabled: !!role,
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

  useEffect(() => {
    if (dataPenilaianDetail) {
      const scheduleId = dataPenilaianDetail.jadwalTrainingId || "";

      if (scheduleId) {
        setValue("jadwalTrainingId", scheduleId);
      }
      setValue("userId", dataPenilaianDetail.userId || "");
      setValue(
        "statusKompetensi",
        dataPenilaianDetail.statusKompetensi || undefined,
      );
      setValue("catatan", dataPenilaianDetail.catatan || "");
    }
  }, [dataPenilaianDetail, setValue]);

  const updatePenilaian = async (payload: IFormEditPenilaian) => {
    await assesmentServices.updateAssesment(selectedId, {
      userId: payload.userId,
      jadwalTrainingId: payload.jadwalTrainingId,
      statusKompetensi: payload.statusKompetensi as
        | "kompeten"
        | "belum_kompeten",
      catatan: payload.catatan || "",
    });
  };

  const {
    mutate: mutateEditPenilaian,
    isPending: isPendingMutateEditPenilaian,
    isSuccess: isSuccessMutateEditPenilaian,
  } = useMutation({
    mutationFn: updatePenilaian,
    onSuccess: () => {
      setToaster({
        title: "Berhasil",
        type: "success",
        message: "Penilaian berhasil diperbarui",
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

  const handleSubmitForm = (payload: IFormEditPenilaian) => {
    mutateEditPenilaian(payload);
  };

  const handleOnClose = (onClose: () => void) => {
    reset();
    onClose();
  };

  return {
    control,
    errors,
    handleSubmitForm: handleSubmit(handleSubmitForm),
    isPendingMutateEditPenilaian,
    isSuccessMutateEditPenilaian,
    handleOnClose,
    dataJadwalTraining,
    isLoadingJadwalTraining,
    dataPeserta,
    isLoadingPeserta,
    isLoadingPenilaianDetail,
    setValue,
  };
};

export default useEditPenilaianModal;
