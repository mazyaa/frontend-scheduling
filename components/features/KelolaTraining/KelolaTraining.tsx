"use client";

import { useSearchParams } from "next/navigation";
import { Key, ReactNode, useCallback, useEffect } from "react";
// import {
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownTrigger,
// } from "@heroui/dropdown";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "@heroui/button";
// import { CiMenuKebab } from "react-icons/ci";
import { useSession } from "next-auth/react";
import { useDisclosure } from "@heroui/modal";
import Image from "next/image";
import { cn } from "@heroui/theme";

import { LIST_KELOLA_TRAINING } from "./KelolaTraining.constants";
import useKelolaTraining from "./useKelolaTraining";
import TambahTrainingModal from "./TambahTrainingModal";
import { EditTrainingModal } from "./EditTrainingModal";
import { DeleteTrainingModal } from "./DeleteTrainingModal";

import useChangeUrl from "@/hooks/useChangeUrl";
import CardTable from "@/components/ui/Card";
import CardMapSkeleton from "@/components/ui/Skeletons/CardSkeleton";

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

          return <Image fill alt="image" src={imageSrc} />;
        }

        case "aksi":
          return (
            <div className="flex items-center flex-row justify-around w-full gap-2">
              <Button
                className={cn(
                  "h-8 px-3 rounded-lg font-medium text-xs",
                  "flex items-center gap-1.5",
                  "bg-blue-50 hover:bg-blue-100",
                  "text-blue-600 hover:text-blue-700",
                  "border border-blue-100 hover:border-blue-200",
                  "transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  "shadow-sm hover:shadow-md",
                )}
                size="sm"
                variant="flat"
                onPress={() => {
                  setSelectedId(String(itemTraining.id));
                  editTrainingModal.onOpen();
                }}
              >
                <FiEdit2 size={13} />
                Edit
              </Button>

              <Button
                className={cn(
                  "h-8 px-3 rounded-lg font-medium text-xs",
                  "flex items-center gap-1.5",
                  "bg-red-50 hover:bg-red-100",
                  "text-red-500 hover:text-red-600",
                  "border border-red-100 hover:border-red-200",
                  "transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  "shadow-sm hover:shadow-md",
                )}
                size="sm"
                variant="flat"
                onPress={() => {
                  setSelectedId(String(itemTraining.id));
                  deleteTrainingModal.onOpen();
                }}
              >
                <FiTrash2 size={13} />
                Delete
              </Button>
            </div>
          );

        default:
          return cellValue as ReactNode;
      }
    },
    [setSelectedId, editTrainingModal, deleteTrainingModal],
  );

  return (
    <section>
      {isLoadingSession ? (
        <CardMapSkeleton />
      ) : (
        <CardTable
          buttonTopContentLabel="Tambah Training"
          columns={LIST_KELOLA_TRAINING}
          data={dataKelolaTraining?.data || []}
          emptyContent="Training tidak ditemukan"
          isLoading={isLoadingKelolaTraining || isRefetchingKelolaTraining}
          placeholderTopContent="Cari Training..."
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
