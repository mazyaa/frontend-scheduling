"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Key, ReactNode, useCallback, useEffect } from "react";
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
import DataTable from "@/components/ui/DataTable/DataTable";
import { TablePageSkeleton } from "@/components/ui/Skeletons";

const KelolaTraining = () => {
  const router = useRouter();
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

  // set url when searchParams change, so when user back to previous page, the url will be updated with the correct query
  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const renderCell = useCallback(
    (itemTraining: Record<string, unknown>, columnKey: Key) => {
      const cellValue = itemTraining[columnKey as keyof typeof itemTraining]; // get value of cell by column key

      switch (columnKey) {
        case "image":
          return (
            <Image alt="image" height={200} src={`${cellValue}`} width={100} />
          );
        case "aksi":
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <CiMenuKebab className="text-default-700" />
                </Button>
              </DropdownTrigger>

              <DropdownMenu>
                <DropdownItem
                  key="detail-training-button"
                  onPress={() => {
                    setSelectedId(`${itemTraining.id}`);
                    editTrainingModal.onOpen();
                  }}
                >
                  Edit Data Training
                </DropdownItem>

                <DropdownItem
                  key="delete-training-button"
                  className="text-danger-600"
                  onPress={() => {
                    setSelectedId(`${itemTraining.id}`);
                    deleteTrainingModal.onOpen();
                  }}
                >
                  Delete Training
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue as ReactNode;
      }
    },
    [router, setSelectedId],
  );

  return (
    <section>
      {isLoadingSession ? ( // show skeleton when if session is still loading
        <TablePageSkeleton />
      ) : (
        <DataTable
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
