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
import { DatePicker } from "@heroui/date-picker";
import { fromDate, getLocalTimeZone } from "@internationalized/date";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";

import useKelolaJadwal from "../useKelolaJadwal";

import useTambahJadwal from "./useTambahJadwalModal";

import { IKelolaTraining } from "@/types/kelolaTraining";
interface PropTypes {
  isOpen: boolean;
  onOpenChange: () => void;
  refetchJadwalTraining: () => void;
}

const TambahJadwalModal = (props: PropTypes) => {
  const { isOpen, onOpenChange, refetchJadwalTraining } = props;
  const onCloseRef = useRef<() => void>();

  const {
    control,
    errors,
    handleSubmitForm,
    handleTambahJadwal,
    isPendingMutateTambahJadwal,
    isSuccessMutateTambahJadwal,

    handleOnClose,
  } = useTambahJadwal();

  const { dataKelolaTraining, isLoadingKelolaTraining } = useKelolaJadwal();

  const disabledSubmit = isPendingMutateTambahJadwal;

  useEffect(() => {
    if (isSuccessMutateTambahJadwal && onCloseRef.current) {
      handleOnClose(onCloseRef.current);
      refetchJadwalTraining();
    }
  }, [isSuccessMutateTambahJadwal, refetchJadwalTraining]);

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent className="m-4">
        {(onClose) => {
          onCloseRef.current = onClose;

          return (
            <form onSubmit={handleSubmitForm(handleTambahJadwal)}>
              <ModalHeader>
                <h3 className="text-medium font-medium text-brand">
                  Tambah Jadwal Training
                </h3>
              </ModalHeader>

              <ModalBody className="flex flex-col gap-5">
                <Controller
                  control={control}
                  name="trainingId"
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="rounded"
                      errorMessage={errors.trainingId?.message}
                      isInvalid={errors.trainingId !== undefined}
                      label="Nama Training"
                      selectedKeys={field.value ? [field.value] : []}
                      variant="bordered"
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;

                        field.onChange(selectedKey);
                      }}
                    >
                      {isLoadingKelolaTraining ? (
                        <SelectItem>
                          <Spinner color="white" size="sm" />
                        </SelectItem>
                      ) : (
                        dataKelolaTraining?.data.map(
                          (training: IKelolaTraining) => (
                            <SelectItem key={training.id}>
                              {training.namaTraining}
                            </SelectItem>
                          ),
                        )
                      )}
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <DatePicker
                      errorMessage={errors.startDate?.message}
                      isInvalid={errors.startDate !== undefined}
                      label="Tanggal Mulai"
                      value={
                        field.value
                          ? fromDate(field.value, getLocalTimeZone())
                          : null
                      }
                      onChange={(dateValue) => {
                        const jsDate = dateValue?.toDate();

                        field.onChange(jsDate ? jsDate.toISOString() : null);
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="duration"
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      className="rounded"
                      errorMessage={errors.duration?.message}
                      isInvalid={errors.duration !== undefined}
                      label="Durasi (dalam hari)"
                      value={field.value ? Number(field.value) : undefined}
                      variant="bordered"
                      onChange={(value) => {
                        field.onChange(Number(value));
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="meetingLink"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="rounded"
                      errorMessage={errors.meetingLink?.message}
                      isInvalid={errors.meetingLink !== undefined}
                      label="Link Meeting"
                      variant="bordered"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="batch"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="rounded"
                      errorMessage={errors.batch?.message}
                      isInvalid={errors.batch !== undefined}
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
                    {isPendingMutateTambahJadwal ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Tambah Jadwal Training"
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

export default TambahJadwalModal;
