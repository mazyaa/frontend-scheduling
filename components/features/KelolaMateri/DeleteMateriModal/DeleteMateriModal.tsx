"use client";

import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useContext } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { IoWarningOutline } from "react-icons/io5";

import { materiServices } from "@/services/materi.service";
import { ToasterContext } from "@/context/ToasterContext";

interface PropTypes {
  isOpen: boolean;
  onOpenChange: () => void;
  refetchKelolaMateri: () => void;
  selectedId: string;
  setSelectedId: Dispatch<SetStateAction<string>>;
}

const DeleteMateriModal = (props: PropTypes) => {
  const {
    isOpen,
    onOpenChange,
    refetchKelolaMateri,
    selectedId,
    setSelectedId,
  } = props;
  const { setToaster } = useContext(ToasterContext);

  const deleteMateri = async () => {
    return await materiServices.deleteMateri(selectedId);
  };

  const { mutate: mutateDeleteMateri, isPending: isPendingMutateDeleteMateri } =
    useMutation({
      mutationFn: deleteMateri,
      onSuccess: () => {
        setToaster({
          title: "Berhasil",
          type: "success",
          message: "Materi berhasil dihapus",
        });
        refetchKelolaMateri();
        setSelectedId("");
      },
      onError: (error) => {
        setToaster({
          title: "Gagal",
          type: "error",
          message: error instanceof Error ? error.message : "Terjadi kesalahan",
        });
      },
    });

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      placement="center"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="m-4">
        {(onClose) => (
          <>
            <ModalHeader>
              <h3 className="text-medium font-medium text-brand">
                Hapus Materi Training
              </h3>
            </ModalHeader>

            <ModalBody className="flex flex-col gap-5">
              <div className="flex flex-col items-center justify-center gap-3">
                <IoWarningOutline className="text-danger" size={60} />
                <p className="text-center font-medium">
                  Apakah Anda yakin ingin menghapus materi ini? <br /> Data yang
                  sudah dihapus tidak dapat dikembalikan.
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <div className="flex flex-row justify-end gap-3 mt-5">
                <Button
                  className="font-medium text-danger-500"
                  disabled={isPendingMutateDeleteMateri}
                  type="button"
                  variant="flat"
                  onPress={onClose}
                >
                  Cancel
                </Button>

                <Button
                  className="font-medium text-white bg-danger"
                  disabled={isPendingMutateDeleteMateri}
                  type="button"
                  onPress={() => {
                    mutateDeleteMateri();
                    onClose();
                  }}
                >
                  {isPendingMutateDeleteMateri ? (
                    <Spinner color="white" size="sm" />
                  ) : (
                    "Hapus"
                  )}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteMateriModal;
