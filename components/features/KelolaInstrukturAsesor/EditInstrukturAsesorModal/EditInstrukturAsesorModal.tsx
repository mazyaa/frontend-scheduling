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
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Skeleton } from "@heroui/skeleton";
import { Select, SelectItem } from "@heroui/select";

import useEditInstrukturAsesorModal from "./useEditInstrukturAsesorModal";

import InputFile from "@/components/ui/InputFile";

interface PropTypes {
  isOpen: boolean;
  selectedId: string;
  onOpenChange: () => void; // for tracking open state of modal, because when user click cancel button, the state of isOpen will be set to false, but when user click add button, the state of isOpen will be set to true, so we need to track the state of modal open or close
  refetchInstrukturAsesor: () => void;
}

const EditInstrukturAsesorModal = (props: PropTypes) => {
  const { isOpen, onOpenChange, selectedId, refetchInstrukturAsesor } = props;
  const onCloseRef = useRef<() => void>();

  const {
    controlUpdateInstrukturAsesor,
    handleSubmitUpdateInstrukturAsesor,
    errorsUpdateInstrukturAsesor,

    preview,

    handleUploadImage,
    handleDeleteImage,
    isPendingMutateUploadFile,
    isPendingMutateDeleteFile,
    handleOnClose,

    instrukturAsesorDataById,

    handleUpdateInstrukturAsesor,
    isPendingMutateUpdateInstrukturAsesor,
    isSuccessMutateUpdateInstrukturAsesor,
  } = useEditInstrukturAsesorModal(selectedId, isOpen);

  const disabledSubmit =
    isPendingMutateUpdateInstrukturAsesor ||
    isPendingMutateDeleteFile ||
    isPendingMutateUploadFile;

  useEffect(() => {
    if (isSuccessMutateUpdateInstrukturAsesor && onCloseRef.current) {
      handleOnClose(onCloseRef.current, false);
      refetchInstrukturAsesor();
    }
  }, [isSuccessMutateUpdateInstrukturAsesor]); // hanya depend pada isSuccess

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent className="m-4 custom-modal-center">
        {(onClose) => {
          onCloseRef.current = onClose; // set onClose function to ref, so we can call it in useEffect when mutation is success, because onClose function is only available in this scope, so we need to set it to ref to make it available in useEffect scope

          return (
            <form
              onSubmit={handleSubmitUpdateInstrukturAsesor(
                handleUpdateInstrukturAsesor,
              )}
            >
              <ModalHeader>
                <h3 className="text-medium text-brand font-medium">
                  Edit Instruktur/Asesor
                </h3>
              </ModalHeader>

              <ModalBody className="flex flex-col gap-5">
                <Skeleton
                  className="rounded-sm"
                  isLoaded={!!instrukturAsesorDataById} // show skeleton when data is null, and show form when data is not null
                >
                  <Controller
                    control={controlUpdateInstrukturAsesor}
                    name="name"
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsUpdateInstrukturAsesor.name?.message ===
                          "string"
                            ? errorsUpdateInstrukturAsesor.name.message
                            : undefined
                        }
                        isInvalid={
                          errorsUpdateInstrukturAsesor.name !== undefined
                        }
                        label="Nama"
                        variant="bordered"
                      />
                    )}
                  />
                </Skeleton>

                <Skeleton
                  className="rounded-sm"
                  isLoaded={!!instrukturAsesorDataById}
                >
                  <Controller
                    control={controlUpdateInstrukturAsesor}
                    name="email"
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsUpdateInstrukturAsesor.email?.message ===
                          "string"
                            ? errorsUpdateInstrukturAsesor.email.message
                            : undefined
                        }
                        isInvalid={
                          errorsUpdateInstrukturAsesor.email !== undefined
                        }
                        label="Email"
                        type="email"
                        variant="bordered"
                      />
                    )}
                  />
                </Skeleton>

                <Skeleton
                  className="rounded-sm"
                  isLoaded={!!instrukturAsesorDataById}
                >
                  <Controller
                    control={controlUpdateInstrukturAsesor}
                    name="noWa"
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsUpdateInstrukturAsesor.noWa?.message ===
                          "string"
                            ? errorsUpdateInstrukturAsesor.noWa.message
                            : undefined
                        }
                        isInvalid={
                          errorsUpdateInstrukturAsesor.noWa !== undefined
                        }
                        label="Nomor WA"
                        variant="bordered"
                      />
                    )}
                  />
                </Skeleton>

                <Skeleton
                  className="rounded-sm"
                  isLoaded={!!instrukturAsesorDataById}
                >
                  <Controller
                    control={controlUpdateInstrukturAsesor}
                    name="role"
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsUpdateInstrukturAsesor.role?.message ===
                          "string"
                            ? errorsUpdateInstrukturAsesor.role.message
                            : undefined
                        }
                        isInvalid={
                          errorsUpdateInstrukturAsesor.role !== undefined
                        }
                        label="Role"
                        selectedKeys={field.value ? [field.value] : []}
                        variant="bordered"
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;

                          field.onChange(selectedKey);
                        }}
                      >
                        <SelectItem key="instruktur">Instruktur</SelectItem>
                        <SelectItem key="asesor">Asesor</SelectItem>
                      </Select>
                    )}
                  />
                </Skeleton>

                <Skeleton
                  className="rounded-sm"
                  isLoaded={!!instrukturAsesorDataById}
                >
                  <Controller
                    control={controlUpdateInstrukturAsesor}
                    name="keahlian"
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsUpdateInstrukturAsesor.keahlian
                            ?.message === "string"
                            ? errorsUpdateInstrukturAsesor.keahlian.message
                            : undefined
                        }
                        isInvalid={
                          errorsUpdateInstrukturAsesor.keahlian !== undefined
                        }
                        label="Keahlian"
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

                <Skeleton
                  className="rounded-sm"
                  isLoaded={!!instrukturAsesorDataById}
                >
                  <div className="flex flex-col gap-3">
                    <Controller
                      control={controlUpdateInstrukturAsesor}
                      name="image"
                      render={({ field: { onChange, ...field } }) => {
                        return (
                          <InputFile
                            {...field} // inject some propperties like onChange, value, name, ref from react hook form to Input component because by default some properties like onChange and value are not connected to react hook form
                            isDropable
                            errorMessage={
                              typeof errorsUpdateInstrukturAsesor.image
                                ?.message === "string"
                                ? errorsUpdateInstrukturAsesor.image.message
                                : undefined
                            }
                            isDeleting={isPendingMutateDeleteFile}
                            isInvalid={
                              errorsUpdateInstrukturAsesor.image !== undefined
                            } // show input error state if have error
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
                <div className="flex flex-row justify-end gap-3 mt-5">
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
                    {isPendingMutateUpdateInstrukturAsesor ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Update Instruktur/Asesor"
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

export { EditInstrukturAsesorModal };
export default EditInstrukturAsesorModal;
