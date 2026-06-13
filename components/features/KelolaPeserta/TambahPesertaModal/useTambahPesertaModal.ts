import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import useMediaHandling from "@/hooks/useMediaHandling";
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
  noWa: yup
    .string()
    .required("Nomor WA wajib diisi")
    .matches(/^\d+$/, "Nomor WA hanya boleh berisi angka")
    .test(
      "no-leading-zero",
      "Nomor WA tidak boleh diawali dengan 0",
      (val) => !val || !val.startsWith("0"),
    ),
  instansi: yup.string().required("Instansi wajib diisi"),
  fileCv: yup.string().required("File CV wajib diunggah"),
  fileIjazah: yup.string().required("File Ijazah wajib diunggah"),
  fileSuratRekomendasi: yup
    .string()
    .required("File Surat Rekomendasi wajib diunggah"),
  fileKtp: yup.string().required("File KTP wajib diunggah"),
  fileFoto: yup.string().required("File Foto wajib diunggah"),
  fileBuktiBayar: yup.string().required("File Bukti Bayar wajib diunggah"),
  fileBuktiFollow: yup.string().required("File Bukti Follow wajib diunggah"),
  jadwalTrainingId: yup.string().required("Jadwal Training wajib dipilih"),
});

const useTambahPesertaModal = () => {
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
    // setValue,
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

  const { data: scheduleData, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ["DropdownJadwalPeserta"],
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
      onChange("uploading..."); // temporary value or just let it be, but setting full file url later
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
    mutate: handleAddPeserta,
    isPending: isPendingMutateAddPeserta,
    isSuccess: isSuccessMutateAddPeserta,
  } = useMutation({
    mutationFn: async (payload: Omit<IParticipant, "id">) => {
      return await participantServices.createParticipant({
        ...payload,
        noWa: `62${payload.noWa}`,
      });
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

export default useTambahPesertaModal;
