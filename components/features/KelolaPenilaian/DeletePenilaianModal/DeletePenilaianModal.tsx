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

import { assesmentServices } from "@/services/assesment.service";
import { ToasterContext } from "@/context/ToasterContext";
import errorHandling from "@/utils/errrorHandling";

interface PropTypes {
  isOpen: boolean;
  onOpenChange: () => void;
  refetchKelolaPenilaian: () => void;
  selectedId: string;
  setSelectedId: Dispatch<SetStateAction<string>>;
}

const DeletePenilaianModal = (props: PropTypes) => {
  const {
    isOpen,
    onOpenChange,
    refetchKelolaPenilaian,
    selectedId,
    setSelectedId,
  } = props;
  const { setToaster } = useContext(ToasterContext);

  const deletePenilaian = async () => {
    return await assesmentServices.deleteAssesment(selectedId);
  };

  const {
    mutate: mutateDeletePenilaian,
    isPending: isPendingMutateDeletePenilaian,
  } = useMutation({
    mutationFn: deletePenilaian,
    onSuccess: () => {
      setToaster({
        title: "Berhasil",
        type: "success",
        message: "Penilaian berhasil dihapus",
      });
      refetchKelolaPenilaian();
      setSelectedId("");
    },
    onError: (error) => {
      const message = errorHandling(error);
      setToaster({
        title: "Gagal",
        type: "error",
        message: message || "Terjadi kesalahan",
      });
      setSelectedId("");
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
                Hapus Penilaian
              </h3>
            </ModalHeader>

            <ModalBody className="flex flex-col gap-5">
              <div className="flex flex-col items-center justify-center gap-3">
                <p className="text-center font-medium">
                  Apakah Anda yakin ingin menghapus penilaian ini?
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <div className="flex flex-row justify-end gap-3 mt-5">
                <Button
                  className="font-medium text-danger-500"
                  disabled={isPendingMutateDeletePenilaian}
                  type="button"
                  variant="flat"
                  onPress={onClose}
                >
                  Cancel
                </Button>

                <Button
                  className="font-medium text-white bg-danger"
                  disabled={isPendingMutateDeletePenilaian}
                  type="button"
                  onPress={() => {
                    mutateDeletePenilaian();
                    onClose();
                  }}
                >
                  {isPendingMutateDeletePenilaian ? (
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

export default DeletePenilaianModal;
