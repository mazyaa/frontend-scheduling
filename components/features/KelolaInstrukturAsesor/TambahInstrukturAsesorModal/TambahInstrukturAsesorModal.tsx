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
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Select, SelectItem } from "@heroui/select";
import { FiInfo } from "react-icons/fi";

import useTambahInstrukturAsesorModal from "./useTambahInstrukturAsesorModal";

import InputFile from "@/components/ui/InputFile";

interface PropTypes {
  isOpen: boolean;
  onOpenChange: () => void; // for tracking open state of modal, because when user click cancel button, the state of isOpen will be set to false, but when user click add button, the state of isOpen will be set to true, so we need to track the state of modal open or close
  refetchInstrukturAsesor: () => void;
}

const Information = ({ message }: { message: string }) => {
  return (
    <div className="flex bg-amber-100 p-1.5 rounded-sm items-center gap-1 text-blue-600 text-xs w-fit cursor-help">
      <FiInfo size={14} />
      <span>{message}</span>
    </div>
  );
};

const TambahInstrukturAsesorModal = (props: PropTypes) => {
  const { isOpen, onOpenChange, refetchInstrukturAsesor } = props;
  const onCloseRef = useRef<() => void>();

  const {
    control,
    errors,
    handleSubmitForm,
    handleAddInstrukturAsesor,
    isPendingMutateAddInstrukturAsesor,
    isSuccessMutateAddInstrukturAsesor,

    preview,

    handleUploadImage,
    handleDeleteImage,
    isPendingMutateUploadFile,
    isPendingMutateDeleteFile,
    handleOnClose,
  } = useTambahInstrukturAsesorModal();

  const disabledSubmit = isPendingMutateAddInstrukturAsesor;

  useEffect(() => {
    if (isSuccessMutateAddInstrukturAsesor && onCloseRef.current) {
      handleOnClose(onCloseRef.current);
      refetchInstrukturAsesor();
    }
  }, [isSuccessMutateAddInstrukturAsesor, refetchInstrukturAsesor]);

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent className="m-4">
        {(onClose) => {
          onCloseRef.current = onClose; // set onClose function to ref, so we can call it in useEffect when mutation is success, because onClose function is only available in this scope, so we need to set it to ref to make it available in useEffect scope

          return (
            <form onSubmit={handleSubmitForm(handleAddInstrukturAsesor)}>
              <ModalHeader>
                <h3 className="text-medium font-medium text-brand">
                  Tambah Instruktur/Asesor Baru
                </h3>
              </ModalHeader>

              <ModalBody className="flex flex-col gap-4">
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="rounded"
                      errorMessage={errors.name?.message}
                      isInvalid={errors.name !== undefined}
                      label="Nama"
                      variant="bordered"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="rounded"
                      errorMessage={errors.email?.message}
                      isInvalid={errors.email !== undefined}
                      label="Email"
                      type="email"
                      variant="bordered"
                    />
                  )}
                />

                <Information message="No WhatsApp Harus diawali dengan 62" />
                <Controller
                  control={control}
                  name="noWa"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="rounded"
                      errorMessage={errors.noWa?.message}
                      isInvalid={errors.noWa !== undefined}
                      label="Nomor Whatsapp"
                      variant="bordered"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="rounded"
                      errorMessage={errors.role?.message}
                      isInvalid={errors.role !== undefined}
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

                <Controller
                  control={control}
                  name="keahlian"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="rounded"
                      errorMessage={errors.keahlian?.message}
                      isInvalid={errors.keahlian !== undefined}
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
                    Cancel
                  </Button>

                  <Button
                    className="font-medium text-white bg-brand"
                    disabled={disabledSubmit}
                    type="submit"
                  >
                    {isPendingMutateAddInstrukturAsesor ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Tambah Instruktur/Asesor"
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

export default TambahInstrukturAsesorModal;
