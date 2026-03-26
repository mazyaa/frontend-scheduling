"use client";

import { useEffect, useRef } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Controller } from "react-hook-form";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Skeleton } from "@heroui/skeleton";

import useEditTrainingModal from "./useEditTrainingModal";

import InputFile from "@/components/ui/InputFile";

interface PropTypes {
  isOpen: boolean;
  selectedId: string;
  onOpenChange: () => void; // for tracking open state of modal, because when user click cancel button, the state of isOpen will be set to false, but when user click add training button, the state of isOpen will be set to true, so we need to track the state of modal open or close
  refetchTraining: () => void;
}

const EditTrainingModal = (props: PropTypes) => {
  const { isOpen, onOpenChange, selectedId, refetchTraining } = props;
  const onCloseRef = useRef<() => void>();

  const {
    controlUpdateTraining,
    handleSubmitUpdateTraining,
    errorsUpdateTraining,
    handleOnClose,

    preview,
    handleUploadImage,
    isPendingMutateUploadFile,
    handleDeleteImage,
    isPendingMutateDeleteFile,

    trainingDataById,

    handleUpdateTraining,
    isPendingMutateUpdateTraining,
    isSuccessMutateUpdateTraining,
  } = useEditTrainingModal(selectedId, isOpen);

  const disabledSubmit =
    isPendingMutateUpdateTraining ||
    isPendingMutateUploadFile ||
    isPendingMutateDeleteFile;

  useEffect(() => {
    if (isSuccessMutateUpdateTraining && onCloseRef.current) {
      handleOnClose(onCloseRef.current, false);
      refetchTraining();
    }
  }, [isSuccessMutateUpdateTraining]); // hanya depend pada isSuccess

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent className="m-4">
        {(onClose) => {
          onCloseRef.current = onClose; // set onClose function to ref, so we can call it in useEffect when mutation is success, because onClose function is only available in this scope, so we need to set it to ref to make it available in useEffect scope

          return (
            <form onSubmit={handleSubmitUpdateTraining(handleUpdateTraining)}>
              <ModalHeader>
                <h3 className="text-lg text-brand font-medium">
                  Edit Training
                </h3>
              </ModalHeader>

              <ModalBody>
                <Skeleton
                  className="rounded-sm"
                  isLoaded={!!trainingDataById} // show skeleton when trainingDataById is null, and show form when trainingDataById is not null
                >
                  <Controller
                    control={controlUpdateTraining}
                    name="namaTraining"
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsUpdateTraining.namaTraining?.message ===
                          "string"
                            ? errorsUpdateTraining.namaTraining.message
                            : undefined
                        }
                        isInvalid={
                          errorsUpdateTraining.namaTraining !== undefined
                        }
                        label="Nama Training"
                        variant="bordered"
                      />
                    )}
                  />
                </Skeleton>

                <Skeleton
                  className="rounded-sm"
                  isLoaded={!!trainingDataById} // show skeleton when trainingDataById is null, and show form when trainingDataById is not null
                >
                  <Controller
                    control={controlUpdateTraining}
                    name="description"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsUpdateTraining.description?.message ===
                          "string"
                            ? errorsUpdateTraining.description.message
                            : undefined
                        }
                        isInvalid={
                          errorsUpdateTraining.description !== undefined
                        }
                        label="Deskripsi"
                        variant="bordered"
                        onKeyDown={(e) => {
                          // submit form when user press ctrl + enter
                          if (e.ctrlKey && e.key === "Enter") {
                            e.preventDefault();
                            document.querySelector("form")?.requestSubmit();
                          }
                        }}
                      />
                    )}
                  />
                </Skeleton>

                <Skeleton className="rounded-sm" isLoaded={!!trainingDataById}>
                  <div className="flex flex-col gap-3">
                    <Controller
                      control={controlUpdateTraining}
                      name="image"
                      render={({ field: { onChange, ...field } }) => {
                        return (
                          <InputFile
                            {...field} // inject some propperties like onChange, value, name, ref from react hook form to Input component because by default some properties like onChange and value are not connected to react hook form
                            isDropable
                            errorMessage={
                              typeof errorsUpdateTraining.image?.message ===
                              "string"
                                ? errorsUpdateTraining.image.message
                                : undefined
                            }
                            isDeleting={isPendingMutateDeleteFile}
                            isInvalid={errorsUpdateTraining.image !== undefined} // show input error state if have error
                            isUploading={isPendingMutateUploadFile}
                            label={
                              <p className="font-bold text-brand text-sm my-2">
                                Image
                              </p>
                            }
                            preview={typeof preview === "string" ? preview : ""}
                            onDelete={() => handleDeleteImage(onChange)} // onChange is coming from react hook form for setting value to form
                            onUpload={(files) =>
                              handleUploadImage(files, onChange)
                            } // params files is coming from handleOnUpload in InputFile component, onChange is coming from react hook form for setting value to form
                          />
                        );
                      }}
                    />
                  </div>
                </Skeleton>
              </ModalBody>

              <ModalFooter>
                <div className="flex flex-row justify-end gap-3">
                  <Button
                    className="font-medium text-danger-500"
                    disabled={disabledSubmit}
                    type="button"
                    variant="flat"
                    onPress={() => handleOnClose(onClose, true)}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="font-medium text-white bg-brand"
                    disabled={disabledSubmit}
                    type="submit"
                  >
                    {isPendingMutateUpdateTraining ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Update Training"
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

export default EditTrainingModal;
