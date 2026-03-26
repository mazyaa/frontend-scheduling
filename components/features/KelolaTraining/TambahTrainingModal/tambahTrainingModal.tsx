"use client";

import { Controller } from "react-hook-form";
import { useEffect, useRef } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

import useTambahTrainingModal from "./useTambahTrainingModal";

import InputFile from "@/components/ui/InputFile";

interface PropTypes {
  isOpen: boolean;
  onOpenChange: () => void; // for tracking open state of modal, because when user click cancel button, the state of isOpen will be set to false, but when user click add training button, the state of isOpen will be set to true, so we need to track the state of modal open or close
  refetchTraining: () => void;
}

const TambahTrainingModal = (props: PropTypes) => {
  const { isOpen, onOpenChange, refetchTraining } = props;
  const onCloseRef = useRef<() => void>();

  const {
    control,
    errors,
    handleSubmitForm,
    handleAddTraining,
    isPendingMutateAddTraining,
    isSuccessMutateAddTraining,

    preview,
    handleUploadImage,
    isPendingMutateUploadFile,
    handleDeleteImage,
    isPendingMutateDeleteFile,
    handleOnClose,
  } = useTambahTrainingModal();

  const disabledSubmit =
    isPendingMutateAddTraining ||
    isPendingMutateUploadFile ||
    isPendingMutateDeleteFile;

  useEffect(() => {
    if (isSuccessMutateAddTraining && onCloseRef.current) {
      handleOnClose(onCloseRef.current);
      refetchTraining();
    }
  }, [isSuccessMutateAddTraining, refetchTraining]);

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent className="m-4">
        {(onClose) => {
          onCloseRef.current = onClose; // set onClose function to ref, so we can call it in useEffect when mutation is success, because onClose function is only available in this scope, so we need to set it to ref to make it available in useEffect scope

          return (
            <form onSubmit={handleSubmitForm(handleAddTraining)}>
              <ModalHeader>
                <h3 className="text-lg font-medium">Tambah Training Baru</h3>
              </ModalHeader>

              <ModalBody>
                <Controller
                  control={control}
                  name="namaTraining"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="rounded"
                      errorMessage={errors.namaTraining?.message}
                      isInvalid={errors.namaTraining !== undefined}
                      label="Nama Training"
                      variant="bordered"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="rounded"
                      errorMessage={errors.description?.message}
                      isInvalid={errors.description !== undefined}
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

                <div className="flex flex-col gap-3">
                  <Controller
                    control={control}
                    name="image"
                    render={({ field: { onChange, ...field } }) => {
                      return (
                        <InputFile
                          {...field} // inject some propperties like onChange, value, name, ref from react hook form to Input component because by default some properties like onChange and value are not connected to react hook form
                          isDropable
                          errorMessage={errors.image?.message}
                          isDeleting={isPendingMutateDeleteFile}
                          isInvalid={errors.image !== undefined} // show input error state if have error
                          isUploading={isPendingMutateUploadFile}
                          label={<p className="font-bold text-sm my-2">Icon</p>}
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
              </ModalBody>

              <ModalFooter>
                <div className="flex flex-row justify-end gap-3">
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
                    {isPendingMutateAddTraining ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Tambah Training"
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

export default TambahTrainingModal;
