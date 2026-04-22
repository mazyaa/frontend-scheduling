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
import { Tooltip } from "@heroui/tooltip";
import { FiInfo } from "react-icons/fi";

import useTambahKeteranganModal from "./useTambahKeteranganModal";

import { IKelolaInstrukturAsesor } from "@/types/kelolaInstrukturAsesor";

interface PropTypes {
  isOpen: boolean;
  selectedId: string;
  onOpenChange: () => void;
  refetchDetailJadwal: () => void;
}

const DisabledInformation = ({ message }: { message: string }) => {
  return (
    <Tooltip content={message} placement="top-start">
      <div className="flex items-center gap-1 text-warning-600 text-xs w-fit cursor-help">
        <FiInfo size={14} />
        <span>{message}</span>
      </div>
    </Tooltip>
  );
};

const TambahKeteranganModal = (props: PropTypes) => {
  const { isOpen, selectedId, onOpenChange, refetchDetailJadwal } = props;
  const onCloseRef = useRef<() => void>();

  const {
    controlTambahKeterangan,
    handleSubmitTambahKeterangan,
    errorsTambahKeterangan,

    isLoadingDetailScheduleById,
    dataTambahKeterangan,

    instrukturOptions,
    asesorOptions,
    isLoadingInstrukturAsesor,

    isLastDay,

    handleOnClose,
    handleTambahKeterangan,
    isPendingTambahKeterangan,
    isSuccessTambahKeterangan,
    resetTambahKeteranganMutation,
  } = useTambahKeteranganModal(selectedId, isOpen);

  const disabledSubmit = isPendingTambahKeterangan;

  useEffect(() => {
    if (isSuccessTambahKeterangan && onCloseRef.current) {
      handleOnClose(onCloseRef.current);
      resetTambahKeteranganMutation();
      refetchDetailJadwal();
    }
  }, [
    isSuccessTambahKeterangan,
    refetchDetailJadwal,
    resetTambahKeteranganMutation,
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
            <form
              onSubmit={handleSubmitTambahKeterangan(handleTambahKeterangan)}
            >
              <ModalHeader>
                <h3 className="text-medium text-brand font-medium">
                  Tambah Keterangan Detail Jadwal
                </h3>
              </ModalHeader>

              <ModalBody className="flex flex-col gap-5">
                <Skeleton
                  className="rounded"
                  isLoaded={!isLoadingDetailScheduleById}
                >
                  <div className="flex flex-col gap-2">
                    <DisabledInformation message="Nama training dihasilkan dari data jadwal utama dan tidak dapat diubah di halaman ini." />
                    <Input
                      isDisabled
                      label="Nama Training"
                      value={dataTambahKeterangan.namaTraining}
                      variant="bordered"
                    />
                  </div>
                </Skeleton>

                <Skeleton
                  className="rounded"
                  isLoaded={!isLoadingDetailScheduleById}
                >
                  <div className="flex flex-col gap-2">
                    <DisabledInformation message="Hari ke digenerate otomatis berdasarkan durasi jadwal training." />
                    <Input
                      isDisabled
                      label="Hari"
                      value={dataTambahKeterangan.hari}
                      variant="bordered"
                    />
                  </div>
                </Skeleton>

                <Skeleton
                  className="rounded"
                  isLoaded={!isLoadingDetailScheduleById}
                >
                  <div className="flex flex-col gap-2">
                    <DisabledInformation message="Tanggal pada detail jadwal digenerate sistem dan tidak dapat diubah dari modal ini." />
                    <Input
                      isDisabled
                      label="Tanggal"
                      value={dataTambahKeterangan.tanggal}
                      variant="bordered"
                    />
                  </div>
                </Skeleton>

                <Skeleton
                  className="rounded"
                  isLoaded={!isLoadingDetailScheduleById}
                >
                  <Controller
                    control={controlTambahKeterangan}
                    name="instrukturId"
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsTambahKeterangan.instrukturId
                            ?.message === "string"
                            ? errorsTambahKeterangan.instrukturId.message
                            : undefined
                        }
                        isDisabled={isLastDay}
                        isInvalid={
                          errorsTambahKeterangan.instrukturId !== undefined
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
                    control={controlTambahKeterangan}
                    name="asesorId"
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="rounded"
                        errorMessage={
                          typeof errorsTambahKeterangan.asesorId?.message ===
                          "string"
                            ? errorsTambahKeterangan.asesorId.message
                            : undefined
                        }
                        isDisabled={!isLastDay}
                        isInvalid={
                          errorsTambahKeterangan.asesorId !== undefined
                        }
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

                <p className="text-xs text-default-500">
                  {isLastDay
                    ? "Hari terakhir: hanya nama asesor yang dapat diubah."
                    : "Bukan hari terakhir: hanya nama instruktur yang dapat diubah."}
                </p>

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
                      {isPendingTambahKeterangan ? (
                        <Spinner color="white" size="sm" />
                      ) : (
                        "Simpan Keterangan"
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

export default TambahKeteranganModal;
