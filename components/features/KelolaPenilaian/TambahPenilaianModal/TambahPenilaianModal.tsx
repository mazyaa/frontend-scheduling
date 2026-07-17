"use client";

import { useEffect, useRef } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Controller } from "react-hook-form";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/input";

import useTambahPenilaianModal from "./useTambahPenilaianModal";

interface PropTypes {
  isOpen: boolean;
  onOpenChange: () => void;
  refetchKelolaPenilaian: () => void;
}

const TambahPenilaianModal = (props: PropTypes) => {
  const { isOpen, onOpenChange, refetchKelolaPenilaian } = props;
  const onCloseRef = useRef<() => void>();

  const {
    control,
    errors,
    handleSubmitForm,
    isPendingMutateTambahPenilaian,
    isSuccessMutateTambahPenilaian,
    handleOnClose,
    dataJadwalTraining,
    isLoadingJadwalTraining,
    dataPeserta,
    isLoadingPeserta,
    setValue,
  } = useTambahPenilaianModal();

  const disabledSubmit = isPendingMutateTambahPenilaian;

  useEffect(() => {
    if (isSuccessMutateTambahPenilaian && onCloseRef.current) {
      handleOnClose(onCloseRef.current);
      refetchKelolaPenilaian();
    }
  }, [isSuccessMutateTambahPenilaian, refetchKelolaPenilaian]);

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      placement="center"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="m-4">
        {(onClose) => {
          onCloseRef.current = onClose;

          return (
            <form onSubmit={handleSubmitForm}>
              <ModalHeader>
                <h3 className="text-medium font-medium text-brand">
                  Tambah Penilaian
                </h3>
              </ModalHeader>

              <ModalBody className="flex flex-col gap-5">
                <Controller
                  control={control}
                  name="jadwalTrainingId"
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="rounded"
                      errorMessage={errors.jadwalTrainingId?.message}
                      isInvalid={errors.jadwalTrainingId !== undefined}
                      label="Jadwal Training"
                      selectedKeys={field.value ? [field.value] : []}
                      variant="bordered"
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;

                        field.onChange(selectedKey);
                        setValue("userId", "");
                      }}
                    >
                      {isLoadingJadwalTraining ? (
                        <SelectItem key="loading" textValue="Loading...">
                          Loading...
                        </SelectItem>
                      ) : (
                        (dataJadwalTraining || []).map((jadwal: any) => {
                          const labelText =
                            jadwal._displayLabel ||
                            `${jadwal.training?.namaTraining || jadwal.training || "Tanpa Nama"} - BATCH-${jadwal.batch}`;

                          return (
                            <SelectItem key={jadwal.id} textValue={labelText}>
                              {labelText}
                            </SelectItem>
                          );
                        })
                      )}
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="userId"
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="rounded"
                      errorMessage={errors.userId?.message}
                      isDisabled={!control._formValues.jadwalTrainingId}
                      isInvalid={errors.userId !== undefined}
                      label="Peserta"
                      selectedKeys={field.value ? [field.value] : []}
                      variant="bordered"
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;

                        field.onChange(selectedKey);
                      }}
                    >
                      {isLoadingPeserta ? (
                        <SelectItem key="loading" textValue="Loading...">
                          Loading...
                        </SelectItem>
                      ) : (
                        (dataPeserta || []).map((peserta: any) => (
                          <SelectItem key={peserta.id} textValue={peserta.name}>
                            {peserta.name}
                          </SelectItem>
                        ))
                      )}
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="statusKompetensi"
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="rounded"
                      errorMessage={errors.statusKompetensi?.message}
                      isInvalid={errors.statusKompetensi !== undefined}
                      label="Status Kompetensi"
                      selectedKeys={field.value ? [field.value] : []}
                      variant="bordered"
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;

                        field.onChange(selectedKey);
                      }}
                    >
                      <SelectItem key="kompeten" textValue="Kompeten">
                        Kompeten
                      </SelectItem>
                      <SelectItem
                        key="belum_kompeten"
                        textValue="Belum Kompeten"
                      >
                        Belum Kompeten
                      </SelectItem>
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="catatan"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="rounded"
                      errorMessage={errors.catatan?.message}
                      isInvalid={errors.catatan !== undefined}
                      label="Catatan (Opsional)"
                      variant="bordered"
                    />
                  )}
                />
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
                    {isPendingMutateTambahPenilaian ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Simpan"
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

export default TambahPenilaianModal;
