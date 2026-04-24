import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { Resolver, useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";

import { kelolaDetailJadwalServices } from "@/services/kelolaDetailJadwal.service";
import { kelolaInstrukturAsesorServices } from "@/services/kelolaInstrukturAsesor.service";
import { ToasterContext } from "@/context/ToasterContext";
import { IKelolaInstrukturAsesor } from "@/types/kelolaInstrukturAsesor";
import { IDetailJadwal } from "@/types/detailKelolaJadwal";
import errorHandling from "@/utils/errrorHandling";

interface IEditKeteranganForm {
  namaTraining: string;
  hari: string;
  tanggal: string;
  instrukturId: string;
  asesorId: string;
}

type IUpdateKeteranganPayload = Partial<
  Pick<IDetailJadwal, "instrukturId" | "asesorId">
>;

const schema = yup.object().shape({
  namaTraining: yup.string().notRequired(),
  hari: yup.string().notRequired(),
  tanggal: yup.string().notRequired(),
  instrukturId: yup.string().when("$isLastDay", {
    is: false,
    then: (currentSchema) =>
      currentSchema.required("Nama instruktur wajib dipilih"),
    otherwise: (currentSchema) => currentSchema.notRequired(),
  }),
  asesorId: yup.string().when("$isLastDay", {
    is: true,
    then: (currentSchema) =>
      currentSchema.required("Nama asesor wajib dipilih"),
    otherwise: (currentSchema) => currentSchema.notRequired(),
  }),
});

const formatScheduleDate = (dateValue?: string) => {
  if (!dateValue) {
    return "-";
  }

  return new Date(dateValue).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
};

const useEditDetailJadwalModal = (id: string, isOpen: boolean) => {
  const { setToaster } = useContext(ToasterContext);

  const getDetailScheduleById = async (detailId: string) => {
    const response =
      await kelolaDetailJadwalServices.getDetailScheduleById(detailId);

    return response.data;
  };

  const { data: detailScheduleById, isLoading: isLoadingDetailScheduleById } =
    useQuery({
      queryKey: ["detailScheduleById", id],
      queryFn: () => getDetailScheduleById(id),
      enabled: !!id && isOpen,
    });

  const jadwalTrainingId = detailScheduleById?.data?.jadwalTrainingId;

  const getMaxHariKeByJadwalTraining = async (
    currentJadwalTrainingId: string,
  ) => {
    const response = await kelolaDetailJadwalServices.getAllDetailJadwal(
      currentJadwalTrainingId,
      "limit=1000&page=1",
    );

    const detailSchedules = response.data?.data || [];

    if (detailSchedules.length === 0) {
      return 0;
    }

    return Math.max(
      ...detailSchedules.map((detail: { hariKe?: number }) =>
        Number(detail.hariKe || 0),
      ),
    );
  };

  const { data: maxHariKe = 0 } = useQuery({
    queryKey: ["maxHariKeByJadwalTraining", jadwalTrainingId],
    queryFn: () => getMaxHariKeByJadwalTraining(String(jadwalTrainingId)),
    enabled: !!jadwalTrainingId && isOpen,
  });

  const currentHariKe = Number(detailScheduleById?.data?.hariKe || 0);
  const isLastDay = currentHariKe > 0 && currentHariKe === maxHariKe;

  const {
    control: controlEditKeterangan,
    handleSubmit: handleSubmitEditKeterangan,
    formState: { errors: errorsEditKeterangan },
    reset: resetEditKeterangan,
    watch,
  } = useForm<IEditKeteranganForm>({
    resolver: yupResolver(schema, {
      context: { isLastDay },
    }) as Resolver<IEditKeteranganForm>,
    values: detailScheduleById
      ? {
          namaTraining:
            detailScheduleById.data?.jadwalTraining?.training?.namaTraining ||
            "-",
          hari: detailScheduleById.data?.hariKe
            ? `Hari ke-${detailScheduleById.data.hariKe}`
            : "-",
          tanggal: formatScheduleDate(detailScheduleById.data?.hari),
          instrukturId: detailScheduleById.data.instrukturId || "",
          asesorId: detailScheduleById.data.asesorId || "",
        }
      : {
          namaTraining: "-",
          hari: "-",
          tanggal: "-",
          instrukturId: "",
          asesorId: "",
        },
  });

  const getInstrukturAsesorOptions = async () => {
    const response =
      await kelolaInstrukturAsesorServices.getAllInstrukturAndAsesor(
        "limit=1000&page=1",
      );
    const data = (response.data?.data || []) as IKelolaInstrukturAsesor[];

    const instrukturOptions = data.filter((item) => item.role === "instruktur");
    const asesorOptions = data.filter((item) => item.role === "asesor");

    return { instrukturOptions, asesorOptions };
  };

  const {
    data: instrukturAsesorOptions,
    isLoading: isLoadingInstrukturAsesor,
  } = useQuery({
    queryKey: ["instrukturAsesorForDetailJadwal"],
    queryFn: getInstrukturAsesorOptions,
    enabled: isOpen,
  });

  const instrukturOptions = instrukturAsesorOptions?.instrukturOptions || [];
  const asesorOptions = instrukturAsesorOptions?.asesorOptions || [];
  const dataEditKeterangan = watch();

  const handleOnClose = (onClose: () => void) => {
    onClose();
    resetEditKeterangan();
  };

  const updateKeteranganById = async (
    detailId: string,
    payload: IUpdateKeteranganPayload,
  ) => {
    const response = await kelolaDetailJadwalServices.updateDetailJadwal(
      detailId,
      payload,
    );

    return response;
  };

  const {
    mutate: mutateEditKeterangan,
    isPending: isPendingEditKeterangan,
    isSuccess: isSuccessEditKeterangan,
    reset: resetEditKeteranganMutation,
  } = useMutation({
    mutationFn: (payload: IUpdateKeteranganPayload) =>
      updateKeteranganById(id, payload),
    onError: (error) => {
      const message = errorHandling(error);

      setToaster({
        title: "Edit Keterangan Gagal",
        type: "error",
        message: message || "Terjadi kesalahan saat mengedit keterangan",
      });
    },
    onSuccess: () => {
      setToaster({
        title: "Edit Keterangan Berhasil",
        type: "success",
        message: "Keterangan jadwal berhasil diperbarui",
      });
    },
  });

  const handleEditKeterangan = (payload: IEditKeteranganForm) => {
    const updatePayload = isLastDay
      ? { asesorId: payload.asesorId || "" }
      : { instrukturId: payload.instrukturId || "" };

    mutateEditKeterangan(updatePayload);
  };

  return {
    controlEditKeterangan,
    handleSubmitEditKeterangan,
    errorsEditKeterangan,

    detailScheduleById,
    isLoadingDetailScheduleById,
    dataEditKeterangan,

    instrukturOptions,
    asesorOptions,
    isLoadingInstrukturAsesor,

    isLastDay,

    handleOnClose,
    handleEditKeterangan,
    isPendingEditKeterangan,
    isSuccessEditKeterangan,
    resetEditKeteranganMutation,
  };
};

export default useEditDetailJadwalModal;
