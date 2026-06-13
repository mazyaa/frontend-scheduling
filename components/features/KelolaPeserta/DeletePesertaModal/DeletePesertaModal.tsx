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

import useDeletePesertaModal from "./useDeletePesertaModal";

import { IParticipant } from "@/types/participant";

interface PropTypes {
  isOpen: boolean;
  onOpenChange: () => void;
  refetchPeserta: () => void;
  selectedData: IParticipant | null;
}

const DeletePesertaModal = (props: PropTypes) => {
  const { isOpen, onOpenChange, refetchPeserta, selectedData } = props;
  const onCloseRef = useRef<() => void>();

  const {
    handleDeletePeserta,
    isPendingMutateDeletePeserta,
    isSuccessMutateDeletePeserta,
  } = useDeletePesertaModal();

  useEffect(() => {
    if (isSuccessMutateDeletePeserta) {
      refetchPeserta();
      if (onCloseRef.current) {
        onCloseRef.current();
      }
    }
  }, [isSuccessMutateDeletePeserta]);

  return (
    <Modal
      hideCloseButton={isPendingMutateDeletePeserta}
      isDismissable={!isPendingMutateDeletePeserta}
      isKeyboardDismissDisabled={isPendingMutateDeletePeserta}
      isOpen={isOpen}
      size="md"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => {
          onCloseRef.current = onClose;

          return (
            <>
              <ModalHeader>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-brand">
                    Hapus Peserta
                  </h2>
                </div>
              </ModalHeader>

              <ModalBody>
                <p className="text-sm font-normal text-black">
                  Apakah Anda yakin ingin menghapus peserta{" "}
                  <span className="font-semibold text-danger">
                    {selectedData?.name}?
                  </span>
                  Data yang sudah dihapus tidak dapat dikembalikan.
                </p>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="default"
                  isDisabled={isPendingMutateDeletePeserta}
                  variant="light"
                  onPress={onClose}
                >
                  Batal
                </Button>
                <Button
                  className="w-32"
                  color="danger"
                  isDisabled={isPendingMutateDeletePeserta}
                  onPress={() => {
                    if (selectedData?.id) {
                      handleDeletePeserta(selectedData.id);
                    }
                  }}
                >
                  {isPendingMutateDeletePeserta ? (
                    <Spinner color="white" size="sm" />
                  ) : (
                    "Hapus"
                  )}
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};

export default DeletePesertaModal;
