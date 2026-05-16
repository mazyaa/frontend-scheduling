import { useContext, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import { participantImportServices } from "@/services/participantImport.services";
import { kelolaJadwalServices } from "@/services/kelolaJadwal.service";
import { IParticipantImportPayload } from "@/types/participantImport";
import errorHandling from "@/utils/errrorHandling";

interface UseImportPesertaModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  refetchPeserta: () => void;
}

const useImportPesertaModal = ({
  isOpen,
  onOpenChange,
  refetchPeserta,
}: UseImportPesertaModalProps) => {
  const { setToaster } = useContext(ToasterContext);

  const [step, setStep] = useState<number>(1);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [selectedJadwalId, setSelectedJadwalId] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleClose = () => {
    onOpenChange(false);
    setPreviewData([]);
    setUploadFile(null);
    setSelectedJadwalId("");
    setStep(1);
  };

  const handleBack = () => {
    setStep(1);
    setUploadFile(null);
    setPreviewData([]);
    setSelectedJadwalId("");
  };

  const { data: scheduleData, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ["DropdownJadwal", isOpen],
    queryFn: async () => {
      const response =
        await kelolaJadwalServices.getAllSchedules("limit=100&page=1");

      return response.data.data;
    },
    enabled: isOpen,
  });

  const previewMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();

      formData.append("file", file);
      const response = await participantImportServices.preview(formData);

      return response.data;
    },
    onSuccess: (responseData) => {
      const actualData = responseData?.data || responseData;
      const rows = actualData?.rowDetail || responseData?.rowDetail;

      if (rows && Array.isArray(rows)) {
        // inject dummy id for heroUI table row mapping
        const mappedData = rows.map((row: any, idx: number) => ({
          ...row,
          id: row.rowNumber || idx,
        }));

        setPreviewData(mappedData);
        setToaster({
          type: "success",
          title: "Sukses",
          message: "File berhasil di-preview!",
        });
        setStep(2);
      } else {
        setToaster({
          type: "error",
          title: "Gagal",
          message: "Format data preview tidak sesuai",
        });
      }
    },
    onError: (error: unknown) => {
      setToaster({
        type: "error",
        title: "Gagal",
        message: errorHandling(error) || "Gagal melakukan preview file",
      });
      setUploadFile(null);
      setPreviewData([]);
    },
  });

  const commitMutation = useMutation({
    mutationFn: async () => {
      if (!selectedJadwalId) throw new Error("Jadwal belum diplih");

      const validParticipants = previewData
        .filter((row: any) => row.status === "VALID")
        .map((row: any) => row.payload as IParticipantImportPayload);

      if (validParticipants.length === 0) {
        throw new Error("Tidak ada data peserta yang VALID untuk di-import");
      }

      await participantImportServices.commit(
        selectedJadwalId,
        validParticipants,
      );
    },
    onSuccess: () => {
      setToaster({
        type: "success",
        title: "Sukses",
        message: "Berhasil import peserta!",
      });
      handleClose();
      refetchPeserta();
    },
    onError: (error: unknown) => {
      setToaster({
        type: "error",
        title: "Gagal",
        message: errorHandling(error) || "Gagal melakukan import peserta",
      });
    },
  });

  const handleUpload = (files: FileList) => {
    if (files && files.length > 0) {
      const file = files[0];

      setUploadFile(file);
      previewMutation.mutate(file);
    }
  };

  const handleDeleteFile = () => {
    setUploadFile(null);
    setPreviewData([]);
  };

  return {
    step,
    handleBack,
    previewData,
    selectedJadwalId,
    setSelectedJadwalId,
    uploadFile,
    scheduleData,
    isLoadingSchedules,
    isPreviewLoading: previewMutation.isPending,
    isCommitLoading: commitMutation.isPending,
    handleUpload,
    handleDeleteFile,
    handleClose,
    handleCommit: () => commitMutation.mutate(),
  };
};

export default useImportPesertaModal;
