"use client";

import { useEffect, useRef } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Controller } from "react-hook-form";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";

import { IoInformationCircleOutline } from "react-icons/io5";

import useTambahMateriModal from "./useTambahMateriModal";

import InputFile from "@/components/ui/InputFile/InputFile";

interface PropTypes {
  isOpen: boolean;
  onOpenChange: () => void;
  refetchKelolaMateri: () => void;
}

const TambahMateriModal = (props: PropTypes) => {
  const { isOpen, onOpenChange, refetchKelolaMateri } = props;
  const onCloseRef = useRef<() => void>();

  const {
    control,
    errors,
    handleSubmitForm,
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
  } = useTambahMateriModal();

  const disabledSubmit = isPendingMutateTambahMateri;

  useEffect(() => {
    if (isSuccessMutateTambahMateri && onCloseRef.current) {
      handleOnClose(onCloseRef.current);
      refetchKelolaMateri();
    }
  }, [isSuccessMutateTambahMateri, refetchKelolaMateri]);

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      placement="center"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="m-4">
        {(onClose) => {
          onCloseRef.current = onClose;

          return (
            <form onSubmit={handleSubmitForm}>
              <ModalHeader>
                <h3 className="text-medium font-medium text-brand">
                  Tambah Materi Training
                </h3>
              </ModalHeader>

              <ModalBody className="flex flex-col gap-5">
                <Controller
                  control={control}
                  name="jadwalTrainingId"
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="rounded"
                      errorMessage={errors.jadwalTrainingId?.message}
                      isInvalid={errors.jadwalTrainingId !== undefined}
                      label="Jadwal Training"
                      selectedKeys={field.value ? [field.value] : []}
                      variant="bordered"
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        field.onChange(selectedKey);
                        // Reset detail hari ketika jadwal berubah
                        setValue("detailJadwalTrainingId", "");
                      }}
                    >
                      {isLoadingJadwalTraining ? (
                        <SelectItem key="loading" textValue="Loading...">
                          Loading...
                        </SelectItem>
                      ) : (
                        (dataJadwalTraining || []).map((jadwal: any) => {
                          const labelText = `${jadwal.training?.namaTraining || "Tanpa Nama"} - BATCH-${jadwal.batch}`;
                          return (
                            <SelectItem key={jadwal.id} textValue={labelText}>
                              {labelText}
                            </SelectItem>
                          );
                        })
                      )}
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="detailJadwalTrainingId"
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="rounded"
                      isDisabled={!control._formValues.jadwalTrainingId}
                      errorMessage={errors.detailJadwalTrainingId?.message}
                      isInvalid={errors.detailJadwalTrainingId !== undefined}
                      label="Detail Hari Training"
                      selectedKeys={field.value ? [field.value] : []}
                      variant="bordered"
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        field.onChange(selectedKey);
                      }}
                    >
                      {isLoadingDetailJadwal ? (
                        <SelectItem key="loading" textValue="Loading...">
                          Loading...
                        </SelectItem>
                      ) : (
                        (dataDetailJadwal || []).map((detail: any) => {
                          const labelText = `Hari ke - ${detail.hariKe}`;
                          return (
                            <SelectItem key={detail.id} textValue={labelText}>
                              {labelText}
                            </SelectItem>
                          );
                        })
                      )}
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="judul"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="rounded"
                      errorMessage={errors.judul?.message}
                      isInvalid={errors.judul !== undefined}
                      label="Judul Materi"
                      variant="bordered"
                    />
                  )}
                />

                <div>
                  <div className="flex items-start gap-2 mb-3 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                    <IoInformationCircleOutline
                      className="mt-0.5 shrink-0"
                      size={16}
                    />
                    <p>
                      Maksimal ukuran file adalah <strong>5 MB</strong>. Format
                      yang diizinkan: <strong>PDF, DOC, DOCX</strong>.
                    </p>
                  </div>
                  <InputFile
                    isDropable
                    accept=".pdf,.doc,.docx"
                    label={
                      <span className="text-sm text-gray-700 mb-1 block">
                        File Materi
                      </span>
                    }
                    name="fileMateri"
                    preview={fileToUpload ? fileToUpload.name : ""}
                    onDelete={() => setFileToUpload(null)}
                    onUpload={(files) => {
                      if (files && files.length > 0) {
                        setFileToUpload(files[0]);
                      }
                    }}
                  />
                </div>
              </ModalBody>

              <ModalFooter>
                <div className="flex flex-row justify-end gap-3 mt-5">
                  <Button
                    className="font-medium text-danger-500"
                    disabled={disabledSubmit}
                    type="button"
                    variant="flat"
                    onPress={() => handleOnClose(onClose)}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="font-medium text-white bg-brand"
                    disabled={disabledSubmit}
                    type="submit"
                  >
                    {isPendingMutateTambahMateri ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Simpan"
                    )}
                  </Button>
                </div>
              </ModalFooter>
            </form>
          );
        }}
      </ModalContent>
    </Modal>
  );
};

export default TambahMateriModal;
