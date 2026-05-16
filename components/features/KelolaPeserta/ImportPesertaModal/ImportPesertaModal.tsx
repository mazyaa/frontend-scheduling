"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Key, useCallback } from "react";
import { cn } from "@heroui/theme";

import useImportPesertaModal from "./useImportPesertaModal";

import InputFile from "@/components/ui/InputFile";
import DataTable from "@/components/ui/DataTable";

interface PropTypes {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  refetchPeserta: () => void;
}

const PREVIEW_COLUMNS = [
  { uid: "rowNumber", name: "ROW" },
  { uid: "name", name: "NAMA" },
  { uid: "email", name: "EMAIL" },
  { uid: "noWa", name: "NO. WHATSAPP" },
  { uid: "status", name: "STATUS" },
  { uid: "errors", name: "ERRORS" },
];

const ImportPesertaModal = ({
  isOpen,
  onOpenChange,
  refetchPeserta,
}: PropTypes) => {
  const {
    step,
    handleBack,
    previewData,
    selectedJadwalId,
    setSelectedJadwalId,
    uploadFile,
    scheduleData,
    isLoadingSchedules,
    isPreviewLoading,
    isCommitLoading,
    handleUpload,
    handleDeleteFile,
    handleClose,
    handleCommit,
  } = useImportPesertaModal({ isOpen, onOpenChange, refetchPeserta });

  const renderCell = useCallback(
    (item: Record<string, unknown>, columnKey: Key) => {
      const payload = item.payload as any;

      switch (columnKey) {
        case "rowNumber":
          return item.rowNumber;
        case "name":
          return payload?.name || "-";
        case "email":
          return payload?.email || "-";
        case "noWa":
          return payload?.noWa || "-";
        case "status":
          return (
            <span
              className={cn(
                "px-2 py-1 rounded text-xs font-semibold",
                item.status === "VALID"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700",
              )}
            >
              {String(item.status)}
            </span>
          );
        case "errors":
          const errorsArr = item.errors as string[];

          return errorsArr && errorsArr.length > 0 ? (
            <ul className="list-disc pl-4 text-xs text-red-500">
              {errorsArr.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          ) : (
            <span className="text-green-500 text-xs">Aman</span>
          );
        default:
          return item[columnKey as keyof typeof item] as React.ReactNode;
      }
    },
    [],
  );

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      size="4xl"
      onOpenChange={handleClose}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Import Data Peserta
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                {step === 1 && (
                  <InputFile
                    accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    isDropable={true}
                    isUploading={isPreviewLoading}
                    label="Upload File Excel Google Form (.xls, .xlsx)"
                    name="fileImport"
                    preview={uploadFile ? uploadFile.name : undefined}
                    onDelete={handleDeleteFile}
                    onUpload={handleUpload}
                  />
                )}

                {step === 2 && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-sm">Preview Data</h3>
                    <div className="w-full overflow-hidden">
                      <DataTable
                        columns={PREVIEW_COLUMNS}
                        data={previewData}
                        emptyContent="Tidak ada data untuk di preview"
                        placeholderTopContent="Cari di preview..."
                        renderCell={renderCell}
                        totalPages={1} // Preview is in-memory, simple pagination mock
                      />
                    </div>

                    <Select
                      className="w-full"
                      isLoading={isLoadingSchedules}
                      label="Assign ke Jadwal Training"
                      placeholder="Pilih Jadwal Training"
                      selectedKeys={selectedJadwalId ? [selectedJadwalId] : []}
                      onChange={(e) => setSelectedJadwalId(e.target.value)}
                    >
                      {scheduleData?.map((jadwal: any) => (
                        <SelectItem key={jadwal.id}>
                          {`Nama Training: ${jadwal.training.namaTraining || "-"} Batch: ${jadwal.batch || "-"}`}
                        </SelectItem>
                      )) || []}
                    </Select>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              {step === 1 ? (
                <Button color="danger" variant="light" onPress={handleClose}>
                  Batal
                </Button>
              ) : (
                <>
                  <Button
                    color="danger"
                    isDisabled={isCommitLoading}
                    variant="light"
                    onPress={handleBack}
                  >
                    Kembali
                  </Button>
                  <Button
                    color="primary"
                    isDisabled={
                      !selectedJadwalId ||
                      previewData.filter((d) => d.status === "VALID").length ===
                        0
                    }
                    isLoading={isCommitLoading}
                    onPress={handleCommit}
                  >
                    Tambah Peserta
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ImportPesertaModal;
