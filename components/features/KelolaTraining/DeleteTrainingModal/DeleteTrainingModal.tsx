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

import useDeleteTrainingModal from "./useDeleteTrainingModal";

interface PropTypes {
  isOpen: boolean;
  selectedId: string;
  setSelectedId: Dispatch<SetStateAction<string>>; // for setting selectedId when user click delete button
  onOpenChange: () => void; // for tracking open state of modal, because when user click cancel button, the state of isOpen will be set to false, but when user click add training button, the state of isOpen will be set to true, so we need to track the state of modal open or close
  refetchTraining: () => void;
}

const DeleteTrainingModal = (props: PropTypes) => {
  const { isOpen, onOpenChange, selectedId, setSelectedId, refetchTraining } =
    props;
  const onCloseRef = useRef<() => void>();

  const {
    handleDeleteTraining,
    isPendingDeleteTraining,
    isSuccessDeleteTraining,
  } = useDeleteTrainingModal(refetchTraining);

  useEffect(() => {
    if (isSuccessDeleteTraining && onCloseRef.current) {
      onCloseRef.current(); // close modal when delete training successfully
    }
  });

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent className="m-4">
        {(onclose) => {
          onCloseRef.current = onclose; // set onClose function to ref, so we can call it in useEffect when mutation is success, because onClose function is only available in this scope, so we need to set it to ref to make it available in useEffect scope

          return (
            <div className="flex flex-col gap-2">
              <ModalHeader>
                <h3 className="text-brand">Delete Training</h3>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm font-medium">
                  Apakah anda yakin ingin{" "}
                  <span className="text-danger">menghapus</span> training ini?
                </p>
              </ModalBody>

              <ModalFooter>
                <div className="flex flex-row justify-end gap-3">
                  <Button
                    className="font-medium text-danger-500"
                    disabled={isPendingDeleteTraining}
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
                    disabled={isPendingDeleteTraining}
                    type="submit"
                    onPress={() => handleDeleteTraining(selectedId)}
                  >
                    {isPendingDeleteTraining ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Delete Training"
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

export default DeleteTrainingModal;
