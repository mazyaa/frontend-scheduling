import { useEffect, useRef } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Controller } from "react-hook-form";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { FiInfo } from "react-icons/fi";

import useEditDetailJadwalModal from "./useEditDetailJadwalModal";

import { IKelolaInstrukturAsesor } from "@/types/kelolaInstrukturAsesor";

interface PropTypes {
  isOpen: boolean;
  selectedId: string;
  onOpenChange: () => void;
  refetchDetailJadwal: () => void;
}

const DisabledInformation = ({ message }: { message: string }) => {
  return (
    <div className="flex bg-amber-100 p-1.5 rounded-sm items-center gap-1 text-warning-600 text-xs w-fit cursor-help">
      <FiInfo size={14} />
      <span>{message}</span>
    </div>
  );
};

const EditDetailJadwalModal = (props: PropTypes) => {
  const { isOpen, selectedId, onOpenChange, refetchDetailJadwal } = props;
  const onCloseRef = useRef<() => void>();

  const {
    controlEditKeterangan,
    handleSubmitEditKeterangan,
    errorsEditKeterangan,

    isLoadingDetailScheduleById,
    dataEditKeterangan,

    instrukturOptions,
    asesorOptions,
    isLoadingInstrukturAsesor,

    isLastDay,

    handleOnClose,
    handleEditKeterangan,
    isPendingEditKeterangan,
    isSuccessEditKeterangan,
    resetEditKeteranganMutation,
  } = useEditDetailJadwalModal(selectedId, isOpen);

  const disabledSubmit = isPendingEditKeterangan;

  useEffect(() => {
    if (isSuccessEditKeterangan && onCloseRef.current) {
      handleOnClose(onCloseRef.current);
      resetEditKeteranganMutation();
      refetchDetailJadwal();
    }
  }, [
    isSuccessEditKeterangan,
    refetchDetailJadwal,
    resetEditKeteranganMutation,
  ]);

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
            <form onSubmit={handleSubmitEditKeterangan(handleEditKeterangan)}>
              <ModalHeader>
                <h3 className="text-medium text-brand font-medium">
                  Edit Keterangan Detail Jadwal
                </h3>
              </ModalHeader>

              <ModalBody className="flex flex-col gap-5">
                <Skeleton
                  className="rounded"
                  isLoaded={!isLoadingDetailScheduleById}
                >
                  <div className="flex flex-col gap-2">
                    <DisabledInformation message="Nama training tidak dapat diubah!" />
                    <Input
                      isDisabled
                      label="Nama Training"
                      value={dataEditKeterangan.namaTraining}
                      variant="bordered"
                    />
                  </div>
                </Skeleton>

                <Skeleton
                  className="rounded"
                  isLoaded={!isLoadingDetailScheduleById}
                >
                  <div className="flex flex-col gap-2">
                    <DisabledInformation message="Hari ke tidak dapat diubah!" />
                    <Input
                      isDisabled
                      label="Hari"
                      value={dataEditKeterangan.hari}
                      variant="bordered"
                    />
                  </div>
                </Skeleton>

                <Skeleton
                  className="rounded"
                  isLoaded={!isLoadingDetailScheduleById}
                >
                  <div className="flex flex-col gap-2">
                    <DisabledInformation message="Tanggal tidak dapat diubah!" />
                    <Input
                      isDisabled
                      label="Tanggal"
                      value={dataEditKeterangan.tanggal}
                      variant="bordered"
                    />
                  </div>
                </Skeleton>

                <div
                  className={`flex mt-3 items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                    isLastDay
                      ? "border-success-200 bg-success-50 text-success-700"
                      : "border-primary-200 bg-primary-50 text-primary-700"
                  }`}
                >
                  <FiInfo className="mt-0.5 shrink-0" size={16} />
                  <div className="leading-relaxed">
                    <p className="font-medium">
                      {!isLastDay ? "Bukan hari terakhir" : "Hari Terakhir"}
                    </p>
                    <p className="text-xs opacity-90">
                      {isLastDay
                        ? "Anda hanya dapat mengubah nama asesor untuk sesi ini."
                        : "Anda hanya dapat mengubah nama instruktur untuk sesi ini."}
                    </p>
                  </div>
                </div>

                <Skeleton
                  className="rounded"
                  isLoaded={!isLoadingDetailScheduleById}
                >
                  <Controller
                    control={controlEditKeterangan}
                    name="instrukturId"
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsEditKeterangan.instrukturId?.message ===
                          "string"
                            ? errorsEditKeterangan.instrukturId.message
                            : undefined
                        }
                        isDisabled={isLastDay}
                        isInvalid={
                          errorsEditKeterangan.instrukturId !== undefined
                        }
                        label="Nama Instruktur"
                        placeholder="Pilih instruktur"
                        selectedKeys={field.value ? [field.value] : []}
                        variant="bordered"
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;

                          field.onChange(selectedKey);
                        }}
                      >
                        {isLoadingInstrukturAsesor ? (
                          <SelectItem>
                            <Spinner color="white" size="sm" />
                          </SelectItem>
                        ) : (
                          instrukturOptions.map(
                            (instruktur: IKelolaInstrukturAsesor) => (
                              <SelectItem key={instruktur.id}>
                                {instruktur.name}
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
                  isLoaded={!isLoadingDetailScheduleById}
                >
                  <Controller
                    control={controlEditKeterangan}
                    name="asesorId"
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsEditKeterangan.asesorId?.message ===
                          "string"
                            ? errorsEditKeterangan.asesorId.message
                            : undefined
                        }
                        isDisabled={!isLastDay}
                        isInvalid={errorsEditKeterangan.asesorId !== undefined}
                        label="Nama Asesor"
                        placeholder="Pilih asesor"
                        selectedKeys={field.value ? [field.value] : []}
                        variant="bordered"
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;

                          field.onChange(selectedKey);
                        }}
                      >
                        {isLoadingInstrukturAsesor ? (
                          <SelectItem>
                            <Spinner color="white" size="sm" />
                          </SelectItem>
                        ) : (
                          asesorOptions.map(
                            (asesor: IKelolaInstrukturAsesor) => (
                              <SelectItem key={asesor.id}>
                                {asesor.name}
                              </SelectItem>
                            ),
                          )
                        )}
                      </Select>
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
                      {isPendingEditKeterangan ? (
                        <Spinner color="white" size="sm" />
                      ) : (
                        "Simpan Perubahan"
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

export default EditDetailJadwalModal;
