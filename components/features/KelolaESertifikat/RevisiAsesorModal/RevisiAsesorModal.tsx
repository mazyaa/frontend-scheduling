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
import { Textarea } from "@heroui/input";
import { IoInformationCircleOutline } from "react-icons/io5";

import useRevisiAsesorModal from "./useRevisiAsesorModal";

import InputFile from "@/components/ui/InputFile/InputFile";

interface PropTypes {
  isOpen: boolean;
  onOpenChange: () => void;
  refetchKelolaESertifikat: () => void;
  selectedId: string;
}

const RevisiAsesorModal = (props: PropTypes) => {
  const { isOpen, onOpenChange, refetchKelolaESertifikat, selectedId } = props;
  const onCloseRef = useRef<() => void>();

  const {
    control,
    errors,
    handleSubmitForm,
    isPendingMutateRevisi,
    isSuccessMutateRevisi,
    handleOnClose,
    fileToUpload,
    setFileToUpload,
  } = useRevisiAsesorModal(selectedId);

  const disabledSubmit = isPendingMutateRevisi;

  useEffect(() => {
    if (isSuccessMutateRevisi && onCloseRef.current) {
      handleOnClose(onCloseRef.current);
      refetchKelolaESertifikat();
    }
  }, [isSuccessMutateRevisi, refetchKelolaESertifikat]);

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
                  Revisi Sertifikat
                </h3>
              </ModalHeader>

              <ModalBody className="flex flex-col gap-5">
                <Controller
                  control={control}
                  name="catatan"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="rounded"
                      errorMessage={errors.catatan?.message}
                      isInvalid={errors.catatan !== undefined}
                      label="Catatan Revisi"
                      placeholder="Masukkan catatan revisi..."
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
                      Format yang diizinkan: <strong>PDF</strong>.
                    </p>
                  </div>
                  <InputFile
                    isDropable
                    accept=".pdf"
                    label={
                      <span className="text-sm text-gray-700 mb-1 block">
                        File Sertifikat Revisi
                      </span>
                    }
                    name="fileRevisi"
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
                    {isPendingMutateRevisi ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Kirim Revisi"
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

export default RevisiAsesorModal;
