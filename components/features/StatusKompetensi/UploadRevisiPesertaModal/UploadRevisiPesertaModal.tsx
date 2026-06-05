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
import { IoInformationCircleOutline } from "react-icons/io5";

import useUploadRevisiPesertaModal from "./useUploadRevisiPesertaModal";

import InputFile from "@/components/ui/InputFile/InputFile";

interface PropTypes {
  isOpen: boolean;
  onOpenChange: () => void;
  refetchStatusKompetensi: () => void;
  selectedPenilaianId: string;
}

const UploadRevisiPesertaModal = (props: PropTypes) => {
  const {
    isOpen,
    onOpenChange,
    refetchStatusKompetensi,
    selectedPenilaianId,
  } = props;
  const onCloseRef = useRef<() => void>();

  const {
    mutateRevisi,
    isPendingMutateRevisi,
    isSuccessMutateRevisi,
    fileToUpload,
    setFileToUpload,
  } = useUploadRevisiPesertaModal(selectedPenilaianId);

  const disabledSubmit = isPendingMutateRevisi;

  useEffect(() => {
    if (isSuccessMutateRevisi && onCloseRef.current) {
      setFileToUpload(null);
      onCloseRef.current();
      refetchStatusKompetensi();
    }
  }, [isSuccessMutateRevisi, refetchStatusKompetensi]);

  const handleOnClose = (onClose: () => void) => {
    setFileToUpload(null);
    onClose();
  };

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
            <>
              <ModalHeader>
                <h3 className="text-medium font-medium text-brand">
                  Upload File Revisi
                </h3>
              </ModalHeader>

              <ModalBody className="flex flex-col gap-5">
                <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                  <IoInformationCircleOutline
                    className="mt-0.5 shrink-0"
                    size={16}
                  />
                  <p>
                    Format yang diizinkan: <strong>PDF</strong>. Maksimal
                    10MB.
                  </p>
                </div>
                <InputFile
                  isDropable
                  accept=".pdf"
                  label={
                    <span className="text-sm text-gray-700 mb-1 block">
                      File Revisi
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
                    Batal
                  </Button>

                  <Button
                    className="font-medium text-white bg-brand"
                    disabled={disabledSubmit || !fileToUpload}
                    type="button"
                    onPress={() => mutateRevisi()}
                  >
                    {isPendingMutateRevisi ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </div>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};

export default UploadRevisiPesertaModal;
