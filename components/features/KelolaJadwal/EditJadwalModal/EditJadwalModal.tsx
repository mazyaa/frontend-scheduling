import { useEffect, useRef } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";
import { Controller } from "react-hook-form";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { DatePicker } from "@heroui/date-picker";
import { fromDate, getLocalTimeZone } from "@internationalized/date";
import { NumberInput } from "@heroui/number-input";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import useKelolaJadwal from "../useKelolaJadwal";

import useEditJadwalModal from "./useEditJadwalModal";

import { IKelolaTraining } from "@/types/kelolaTraining";

interface PropTypes {
  isOpen: boolean;
  selectedId: string;
  onOpenChange: () => void;
  refetchJadwalTraining: () => void;
}

const EditJadwalModal = (props: PropTypes) => {
  const { isOpen, selectedId, onOpenChange, refetchJadwalTraining } = props;
  const onCloseRef = useRef<() => void>();
  const { dataKelolaTraining, isLoadingKelolaTraining } = useKelolaJadwal();

  const {
    controlUpdateJadwalTraining,
    handleSubmitUpdateJadwalTraining,
    errorsUpdateJadwalTraining,

    jadwalTrainingDataById,
    handleOnClose,

    handleUpdateJadwalTraining,
    isPendingEditJadwalTraining,
    isSuccessEditJadwalTraining,
  } = useEditJadwalModal(selectedId, isOpen);

  const disabledSubmit = isPendingEditJadwalTraining;

  useEffect(() => {
    if (isSuccessEditJadwalTraining && onCloseRef.current) {
      handleOnClose(onCloseRef.current);
      refetchJadwalTraining();
    }
  }, [isSuccessEditJadwalTraining]);

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent className="m-4">
        {(onClose) => {
          onCloseRef.current = onClose;

          return (
            <form
              onSubmit={handleSubmitUpdateJadwalTraining(
                handleUpdateJadwalTraining,
              )}
            >
              <ModalHeader>
                <h3 className="text-medium text-brand font-medium">
                  Edit Jadwal Training
                </h3>
              </ModalHeader>

              <ModalBody className="flex flex-col gap-5">
                <Skeleton
                  className="rounded-sm"
                  isLoaded={!!jadwalTrainingDataById}
                >
                  <Controller
                    control={controlUpdateJadwalTraining}
                    name="trainingId"
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsUpdateJadwalTraining.trainingId ===
                          "string"
                            ? errorsUpdateJadwalTraining.trainingId
                            : undefined
                        }
                        isInvalid={
                          errorsUpdateJadwalTraining.trainingId !== undefined
                        }
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
                </Skeleton>

                <Skeleton
                  className="rounded"
                  isLoaded={!!jadwalTrainingDataById}
                >
                  <Controller
                    control={controlUpdateJadwalTraining}
                    name="startDate"
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        errorMessage={
                          typeof errorsUpdateJadwalTraining.startDate ===
                          "string"
                            ? errorsUpdateJadwalTraining.startDate
                            : undefined
                        } // err message
                        granularity="day" // only allow user to select date, not time
                        isInvalid={
                          errorsUpdateJadwalTraining.startDate !== undefined
                        } // trigger style error
                        label="Tanggal Mulai"
                        value={
                          field.value
                            ? fromDate(
                                new Date(field.value),
                                getLocalTimeZone(),
                              ) // created date object from ISO string to
                            : null
                        }
                        onChange={(dateValue) => {
                          const jsDate = dateValue?.toDate();

                          const formattedDate = jsDate
                            ? jsDate.toLocaleDateString("sv-SE")
                            : null; // format date to ISO string

                          field.onChange(formattedDate);
                        }}
                      />
                    )}
                  />
                </Skeleton>

                <Skeleton
                  className="rounded"
                  isLoaded={!!jadwalTrainingDataById}
                >
                  <Controller
                    control={controlUpdateJadwalTraining}
                    name="duration"
                    render={({ field }) => (
                      <NumberInput
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsUpdateJadwalTraining.duration
                            ?.message === "string"
                            ? errorsUpdateJadwalTraining.duration?.message
                            : undefined
                        }
                        isInvalid={
                          errorsUpdateJadwalTraining.duration !== undefined
                        }
                        label="Durasi (dalam hari)"
                        value={field.value ? Number(field.value) : undefined}
                        variant="bordered"
                        onChange={(value) => {
                          field.onChange(Number(value));
                        }}
                      />
                    )}
                  />
                </Skeleton>

                <Skeleton
                  className="rounded"
                  isLoaded={!!jadwalTrainingDataById}
                >
                  <Controller
                    control={controlUpdateJadwalTraining}
                    name="meetingLink"
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsUpdateJadwalTraining.meetingLink
                            ?.message === "string"
                            ? errorsUpdateJadwalTraining.meetingLink?.message
                            : undefined
                        }
                        isInvalid={
                          errorsUpdateJadwalTraining.meetingLink !== undefined
                        }
                        label="Link Meeting"
                        variant="bordered"
                      />
                    )}
                  />
                </Skeleton>

                <Skeleton
                  className="rounded"
                  isLoaded={!!jadwalTrainingDataById}
                >
                  <Controller
                    control={controlUpdateJadwalTraining}
                    name="batch"
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsUpdateJadwalTraining.batch?.message ===
                          "string"
                            ? errorsUpdateJadwalTraining.batch?.message
                            : undefined
                        }
                        isInvalid={
                          errorsUpdateJadwalTraining.batch !== undefined
                        }
                        label="batch"
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
                      {isPendingEditJadwalTraining ? (
                        <Spinner color="white" size="sm" />
                      ) : (
                        "Tambah Jadwal Training"
                      )}
                    </Button>
                  </div>
                </ModalFooter>
              </ModalBody>
            </form>
          );
        }}
      </ModalContent>
    </Modal>
  );
};

export default EditJadwalModal;
