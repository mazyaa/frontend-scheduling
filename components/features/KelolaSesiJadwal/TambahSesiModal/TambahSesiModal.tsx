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

  const { handleTambahSesi, isPending } = useTambahSesi({
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
            <ModalHeader className="flex flex-col gap-1">
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
                  <Input
                    {...field}
                    label="PIC"
                    placeholder="Masukkan PIC (Opsional)"
                  />
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
              <Button color="primary" isLoading={isPending} type="submit">
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
