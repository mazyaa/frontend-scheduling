import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

import useDeleteSesi from "./useDeleteSesi";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  refetchSesiJadwal: () => void;
  selectedId: string;
}

const DeleteSesiModal = ({
  isOpen,
  onOpenChange,
  refetchSesiJadwal,
  selectedId,
}: Props) => {
  const { handleDeleteSesi, isPending } = useDeleteSesi({
    selectedId,
    refetchSesiJadwal,
    onOpenChange,
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Hapus Sesi Jadwal
            </ModalHeader>
            <ModalBody>
              <p>
                Apakah Anda yakin ingin menghapus sesi jadwal ini? Tindakan ini
                tidak dapat dibatalkan.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                isDisabled={isPending}
                variant="light"
                onPress={onClose}
              >
                Batal
              </Button>
              <Button
                color="danger"
                isLoading={isPending}
                onPress={() => handleDeleteSesi()}
              >
                Ya, Hapus
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteSesiModal;
