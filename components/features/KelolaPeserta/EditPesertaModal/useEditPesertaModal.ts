import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import { participantServices } from "@/services/participant.service";
import useMediaHandling from "@/hooks/useMediaHandling";
import { IParticipant } from "@/types/participant";
import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import errorHandling from "@/utils/errrorHandling";

const FILE_FIELDS = [
  "fileCv",
  "fileIjazah",
  "fileSuratRekomendasi",
  "fileKtp",
  "fileFoto",
  "fileBuktiBayar",
  "fileBuktiFollow",
] as const;

const schema = yup.object().shape({
  name: yup.string().required("Nama wajib diisi"),
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  noWa: yup.string().required("Nomor WA wajib diisi"),
  instansi: yup.string().required("Instansi wajib diisi"),
  fileCv: yup.string().notRequired(),
  fileIjazah: yup.string().notRequired(),
  fileSuratRekomendasi: yup.string().notRequired(),
  fileKtp: yup.string().notRequired(),
  fileFoto: yup.string().notRequired(),
  fileBuktiBayar: yup.string().notRequired(),
  fileBuktiFollow: yup.string().notRequired(),
  jadwalTrainingId: yup.string().required("Jadwal Training wajib dipilih"),
});

const useEditPesertaModal = (selectedData: IParticipant | null) => {
  const { setToaster } = useContext(ToasterContext);
  const {
    mutateUploadFile,
    isPendingMutateUploadFile,
    mutateDeleteFile,
    isPendingMutateDeleteFile,
  } = useMediaHandling();

  const {
    control,
    handleSubmit: handleSubmitForm,
    formState: { errors },
    reset,
    watch,
    setValue,
    // getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      noWa: "",
      instansi: "",
      fileCv: "",
      fileIjazah: "",
      fileSuratRekomendasi: "",
      fileKtp: "",
      fileFoto: "",
      fileBuktiBayar: "",
      fileBuktiFollow: "",
      jadwalTrainingId: "",
    },
  });

  useEffect(() => {
    if (selectedData) {
      setValue("name", selectedData.name || "");
      setValue("email", selectedData.email || "");
      setValue("noWa", selectedData.noWa || "");
      setValue("instansi", selectedData.profilPeserta?.instansi || "");
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

  const handleUploadFile = (
    files: FileList,
    onChange: (file: string | undefined) => void,
  ) => {
    if (files.length !== 0) {
      onChange("uploading..."); // temporary
      mutateUploadFile({
        file: files[0],
        callback: (fileUrl: string) => {
          onChange(fileUrl);
        },
      });
    }
  };

  const handleDeleteFile = (
    fileUrl: string | null | undefined,
    onChange: (file: string | undefined) => void,
  ) => {
    if (
      typeof fileUrl === "string" &&
      fileUrl !== "uploading..." &&
      fileUrl !== ""
    ) {
      mutateDeleteFile({
        fileUrl,
        callback: () => {
          onChange("");
        },
      });
    } else {
      onChange("");
    }
  };

  const watchFileCv = watch("fileCv");
  const watchFileIjazah = watch("fileIjazah");
  const watchFileSuratRekomendasi = watch("fileSuratRekomendasi");
  const watchFileKtp = watch("fileKtp");
  const watchFileFoto = watch("fileFoto");
  const watchFileBuktiBayar = watch("fileBuktiBayar");
  const watchFileBuktiFollow = watch("fileBuktiFollow");

  const {
    mutate: handleEditPeserta,
    isPending: isPendingMutateEditPeserta,
    isSuccess: isSuccessMutateEditPeserta,
  } = useMutation({
    mutationFn: async (payload: Partial<IParticipant>) => {
      if (!selectedData?.id) throw new Error("ID Peserta tidak ditemukan");

      const cleanPayload = { ...payload } as Record<string, unknown>;

      // Hapus field file yang bernilai falsy untuk menghindari overwrite data dengan string kosong
      FILE_FIELDS.forEach((field) => {
        if (!cleanPayload[field]) {
          delete cleanPayload[field];
        }
      });

      return await participantServices.updateParticipant(
        selectedData.id,
        cleanPayload as Partial<IParticipant>,
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
    handleUploadFile,
    handleDeleteFile,
    isPendingMutateUploadFile,
    isPendingMutateDeleteFile,
    watchFileCv,
    watchFileIjazah,
    watchFileSuratRekomendasi,
    watchFileKtp,
    watchFileFoto,
    watchFileBuktiBayar,
    watchFileBuktiFollow,
  };
};

export default useEditPesertaModal;
