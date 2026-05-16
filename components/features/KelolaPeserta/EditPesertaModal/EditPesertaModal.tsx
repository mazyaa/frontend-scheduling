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

import useEditPesertaModal from "./useEditPesertaModal";

import { IParticipant } from "@/types/participant";

interface PropTypes {
  isOpen: boolean;
  onOpenChange: () => void;
  refetchPeserta: () => void;
  selectedData: IParticipant | null;
}

const EditPesertaModal = (props: PropTypes) => {
  const { isOpen, onOpenChange, refetchPeserta, selectedData } = props;
  const onCloseRef = useRef<() => void>();

  const {
    control,
    errors,
    handleSubmitForm,
    handleEditPeserta,
    isPendingMutateEditPeserta,
    isSuccessMutateEditPeserta,
    scheduleData,
    isLoadingSchedules,
    reset,
  } = useEditPesertaModal(selectedData);

  useEffect(() => {
    if (isSuccessMutateEditPeserta) {
      refetchPeserta();
      if (onCloseRef.current) {
        onCloseRef.current();
      }
    }
  }, [isSuccessMutateEditPeserta]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  return (
    <Modal
      hideCloseButton={isPendingMutateEditPeserta}
      isDismissable={!isPendingMutateEditPeserta}
      isKeyboardDismissDisabled={isPendingMutateEditPeserta}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => {
          onCloseRef.current = onClose;

          return (
            <>
              <ModalHeader>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Ubah Peserta
                  </h2>
                  <p className="text-sm font-normal text-slate-500">
                    Ubah data peserta di bawah ini
                  </p>
                </div>
              </ModalHeader>

              <ModalBody>
                <form className="flex flex-col gap-4">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.name?.message}
                        isInvalid={!!errors.name}
                        label="Nama"
                        labelPlacement="outside"
                        placeholder="Nama Peserta"
                        type="text"
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
                        errorMessage={errors.email?.message}
                        isInvalid={!!errors.email}
                        label="Email"
                        labelPlacement="outside"
                        placeholder="Email Peserta"
                        type="email"
                        variant="bordered"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="noWa"
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.noWa?.message}
                        isInvalid={!!errors.noWa}
                        label="No WhatsApp"
                        labelPlacement="outside"
                        placeholder="Nomor WhatsApp Peserta"
                        type="text"
                        variant="bordered"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="instansi"
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.instansi?.message}
                        isInvalid={!!errors.instansi}
                        label="Instansi"
                        labelPlacement="outside"
                        placeholder="Instansi Peserta (opsional)"
                        type="text"
                        variant="bordered"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="jadwalTrainingId"
                    render={({ field: { value, onChange } }) => (
                      <Select
                        errorMessage={errors.jadwalTrainingId?.message}
                        isInvalid={!!errors.jadwalTrainingId}
                        isLoading={isLoadingSchedules}
                        label="Jadwal Training"
                        labelPlacement="outside"
                        placeholder="Pilih Jadwal Training"
                        selectedKeys={value ? new Set([value]) : new Set()}
                        variant="bordered"
                        onSelectionChange={(keys) => {
                          const result = Array.from(keys).join("");

                          onChange(result || "");
                        }}
                      >
                        {Array.isArray(scheduleData)
                          ? scheduleData.map((sked: any) => (
                              <SelectItem key={sked.id} value={sked.id}>
                                {`${sked.name} - ${sked.status}`}
                              </SelectItem>
                            ))
                          : []}
                      </Select>
                    )}
                  />
                </form>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  isDisabled={isPendingMutateEditPeserta}
                  variant="light"
                  onPress={onClose}
                >
                  Batal
                </Button>
                <Button
                  className="w-32"
                  color="primary"
                  isDisabled={isPendingMutateEditPeserta}
                  onPress={handleSubmitForm((data) =>
                    handleEditPeserta(data as any),
                  )}
                >
                  {isPendingMutateEditPeserta ? (
                    <Spinner color="white" size="sm" />
                  ) : (
                    "Simpan Perubahan"
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

export default EditPesertaModal;
