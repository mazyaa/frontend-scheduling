import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useParams } from "next/navigation";

import useTambahSesi from "./useTambahSesi";

import { IKelolaSesiJadwal } from "@/types/kelolaSesiJadwal";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  refetchSesiJadwal: () => void;
}

const TambahSesiModal = ({
  isOpen,
  onOpenChange,
  refetchSesiJadwal,
}: Props) => {
  const params = useParams();
  const detailJadwalId = params.detailJadwalId as string;

  const { control, handleSubmit, reset } = useForm<
    Omit<IKelolaSesiJadwal, "id">
  >({
    defaultValues: {
      detailJadwalTrainingId: detailJadwalId,
      jamMulai: "",
      jamSelesai: "",
      aktivitas: "",
      pic: "",
    },
  });

  const {
    handleTambahSesi,
    isPending,
    dataDetailSesi,
    isLoadingSesiJadwal,
    isRefetchingSesiJadwal,
  } = useTambahSesi({
    refetchSesiJadwal,
    onOpenChange,
    reset,
  });

  const onSubmit = (data: Omit<IKelolaSesiJadwal, "id">) => {
    handleTambahSesi({ ...data, detailJadwalTrainingId: detailJadwalId });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex text-brand flex-col gap-1">
              Tambah Sesi Jadwal
            </ModalHeader>
            <ModalBody>
              <Controller
                control={control}
                name="jamMulai"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Jam Mulai"
                    placeholder="Contoh: 08:00"
                    type="time"
                  />
                )}
                rules={{ required: "Jam Mulai harus diisi" }}
              />
              <Controller
                control={control}
                name="jamSelesai"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Jam Selesai"
                    placeholder="Contoh: 09:00"
                    type="time"
                  />
                )}
                rules={{ required: "Jam Selesai harus diisi" }}
              />
              <Controller
                control={control}
                name="aktivitas"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Aktivitas"
                    placeholder="Masukkan aktivitas"
                  />
                )}
                rules={{ required: "Aktivitas harus diisi" }}
              />
              <Controller
                control={control}
                name="pic"
                render={({ field }) => (
                  <Select
                    {...field}
                    isDisabled={isLoadingSesiJadwal || isRefetchingSesiJadwal}
                    isLoading={isLoadingSesiJadwal || isRefetchingSesiJadwal}
                    label="PIC"
                    placeholder="Pilih PIC"
                  >
                    {[
                      { value: "MC", label: "MC" },
                      ...(dataDetailSesi?.[0]?.detailJadwalTraining?.instruktur
                        ?.name
                        ? [
                            {
                              value:
                                dataDetailSesi[0].detailJadwalTraining
                                  .instruktur.name,
                              label:
                                dataDetailSesi[0].detailJadwalTraining
                                  .instruktur.name,
                            },
                          ]
                        : []),
                      ...(dataDetailSesi?.[0]?.detailJadwalTraining?.asesor
                        ?.name
                        ? [
                            {
                              value:
                                dataDetailSesi[0].detailJadwalTraining.asesor
                                  .name,
                              label:
                                dataDetailSesi[0].detailJadwalTraining.asesor
                                  .name,
                            },
                          ]
                        : []),
                    ].map((option) => (
                      <SelectItem key={option.value}>{option.label}</SelectItem>
                    ))}
                  </Select>
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                isDisabled={isPending}
                variant="light"
                onPress={onClose}
              >
                Tutup
              </Button>
              <Button
                className="text-white bg-brand"
                isLoading={isPending}
                type="submit"
              >
                Simpan
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TambahSesiModal;
