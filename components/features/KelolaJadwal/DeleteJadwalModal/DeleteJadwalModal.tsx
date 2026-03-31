"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

import useDeleteJadwal from "./useDeleteJadwalModal";

interface PropTypes {
  isOpen: boolean;
  selectedId: string;
  setSelectedId: Dispatch<SetStateAction<string>>;
  onOpenChange: () => void;
  refetchJadwalTraining: () => void;
}

const DeleteJadwalModal = (props: PropTypes) => {
  const {
    isOpen,
    selectedId,
    setSelectedId,
    onOpenChange,
    refetchJadwalTraining,
  } = props;

  const onCloseRef = useRef<() => void>();

  const {
    handleDeleteTraining,
    isPendingDeleteJadwalTraining,
    isSuccessDeleteJadwalTraining,
    resetDeleteJadwalTraining,
  } = useDeleteJadwal(refetchJadwalTraining);

  useEffect(() => {
    if (isSuccessDeleteJadwalTraining && onCloseRef.current) {
      onCloseRef.current();
      setSelectedId("");
      resetDeleteJadwalTraining();
    }
  }, [isSuccessDeleteJadwalTraining, resetDeleteJadwalTraining]);

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent className="m-4">
        {(onclose) => {
          onCloseRef.current = onclose; // set onClose function to ref, so we can call it in useEffect when mutation is success, because onClose function is only available in this scope, so we need to set it to ref to make it available in useEffect scope

          return (
            <div className="flex flex-col gap-2">
              <ModalHeader>
                <h3 className="text-brand">Delete Jadwal Training</h3>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm">
                  Apakah anda yakin ingin{" "}
                  <span className="text-danger">menghapus</span> Jadwal Training
                  ini?
                </p>
              </ModalBody>

              <ModalFooter>
                <div className="flex flex-row justify-end gap-3">
                  <Button
                    className="font-medium text-danger-500"
                    disabled={isPendingDeleteJadwalTraining}
                    type="button"
                    variant="flat"
                    onPress={() => {
                      onCloseRef.current?.(); // close modal when user click cancel button
                      setSelectedId(""); // reset selectedId when user click cancel button
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="font-medium text-white bg-danger"
                    disabled={isPendingDeleteJadwalTraining}
                    type="submit"
                    onPress={() => handleDeleteTraining(selectedId)}
                  >
                    {isPendingDeleteJadwalTraining ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Delete Jadwal"
                    )}
                  </Button>
                </div>
              </ModalFooter>
            </div>
          );
        }}
      </ModalContent>
    </Modal>
  );
};

export default DeleteJadwalModal;
