"use client";

import { useSearchParams } from "next/navigation";
import { Key, useCallback, useEffect } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { CiMenuKebab } from "react-icons/ci";
import { useSession } from "next-auth/react";
import { useDisclosure } from "@heroui/modal";
import Image from "next/image";

import { LIST_KELOLA_TRAINING } from "./KelolaTraining.constants";
import useKelolaTraining from "./useKelolaTraining";
import TambahTrainingModal from "./TambahTrainingModal";
import { EditTrainingModal } from "./EditTrainingModal";
import { DeleteTrainingModal } from "./DeleteTrainingModal";

import useChangeUrl from "@/hooks/useChangeUrl";
import CardTable from "@/components/ui/Card";
import { TablePageSkeleton } from "@/components/ui/Skeletons";

const KelolaTraining = () => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";

  const {
    dataKelolaTraining,
    isLoadingKelolaTraining,
    isRefetchingKelolaTraining,
    refetchKelolaTraining,
    selectedId,
    setSelectedId,
  } = useKelolaTraining();

  const { setUrl } = useChangeUrl();

  const tambahTrainingModal = useDisclosure();
  const editTrainingModal = useDisclosure();
  const deleteTrainingModal = useDisclosure();

  // sync URL
  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const renderCell = useCallback(
    (itemTraining: Record<string, unknown>, columnKey: Key) => {
      const cellValue = itemTraining[columnKey as keyof typeof itemTraining];

      switch (columnKey) {
        case "image": {
          const imageSrc =
            typeof cellValue === "string" && cellValue.trim() !== ""
              ? cellValue
              : "/images/placeholder.png";

          return (
            <div className="relative w-full h-24 overflow-hidden rounded-lg">
              <Image
                fill
                alt="image"
                className="object-cover transition duration-300 hover:scale-105"
                sizes="100vw"
                src={imageSrc}
              />
            </div>
          );
        }

        // ⚙️ ACTION (lebih modern & subtle)
        case "aksi":
          return (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  className="rounded-full hover:bg-gray-100 transition"
                  size="sm"
                  variant="light"
                >
                  <CiMenuKebab className="text-gray-600 text-lg" />
                </Button>
              </DropdownTrigger>

              <DropdownMenu aria-label="Actions" className="min-w-[160px]">
                <DropdownItem
                  key="edit-training"
                  className="text-sm"
                  onPress={() => {
                    setSelectedId(String(itemTraining.id));
                    editTrainingModal.onOpen();
                  }}
                >
                  ✏️ Edit Training
                </DropdownItem>

                <DropdownItem
                  key="delete-training"
                  className="text-danger text-sm"
                  onPress={() => {
                    setSelectedId(String(itemTraining.id));
                    deleteTrainingModal.onOpen();
                  }}
                >
                  🗑️ Delete Training
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );

        // 🧾 DEFAULT (lebih clean & readable)
        default: {
          const value =
            typeof cellValue === "string" || typeof cellValue === "number"
              ? cellValue
              : null;

          return (
            <span className="text-sm text-gray-700 font-medium line-clamp-2">
              {value || (
                <span className="text-gray-400 italic">Tidak ada data</span>
              )}
            </span>
          );
        }
      }
    },
    [setSelectedId, editTrainingModal, deleteTrainingModal],
  );

  return (
    <section>
      {isLoadingSession ? (
        <TablePageSkeleton />
      ) : (
        <CardTable
          buttonTopContentLabel="Tambah Training"
          columns={LIST_KELOLA_TRAINING}
          data={dataKelolaTraining?.data || []}
          emptyContent="Training tidak ditemukan"
          isLoading={isLoadingKelolaTraining || isRefetchingKelolaTraining}
          renderCell={renderCell}
          totalPages={
            dataKelolaTraining ? dataKelolaTraining.pagination.totalPages : 1
          }
          onClickButtonTopContent={() => {
            tambahTrainingModal.onOpen();
          }}
        />
      )}

      <TambahTrainingModal
        {...tambahTrainingModal}
        refetchTraining={refetchKelolaTraining}
      />

      <EditTrainingModal
        {...editTrainingModal}
        refetchTraining={refetchKelolaTraining}
        selectedId={selectedId}
      />

      <DeleteTrainingModal
        {...deleteTrainingModal}
        refetchTraining={refetchKelolaTraining}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </section>
  );
};

export default KelolaTraining;
