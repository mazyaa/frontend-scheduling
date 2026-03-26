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

import { LIST_KELOLA_INSTRUKTUR_ASESOR } from "./kelolaInstrukturAsesor.constants";
import useKelolaInstrukturAsesor from "./useKelolaInstrukturAsesor";
import TambahInstrukturAsesorModal from "./TambahInstrukturAsesorModal";
import { EditInstrukturAsesorModal } from "./EditInstrukturAsesorModal";
import { DeleteInstrukturAsesorModal } from "./DeleteInstrukturAsesorModal";

import useChangeUrl from "@/hooks/useChangeUrl";
import DataTable from "@/components/ui/DataTable/DataTable";
import { TablePageSkeleton } from "@/components/ui/Skeletons";

const KelolaInstrukturAsesor = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";

  const {
    dataKelolaInstrukturAsesor,
    isLoadingKelolaInstrukturAsesor,
    isRefetchingKelolaInstrukturAsesor,
    refetchKelolaInstrukturAsesor,
    selectedId,
    setSelectedId,
  } = useKelolaInstrukturAsesor();

  const { setUrl } = useChangeUrl();

  const tambahInstrukturAsesorModal = useDisclosure();
  const editInstrukturAsesorModal = useDisclosure();
  const deleteInstrukturAsesorModal = useDisclosure();

  // set url when searchParams change, so when user back to previous page, the url will be updated with the correct query
  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const renderCell = useCallback(
    (itemInstrukturAsesor: Record<string, unknown>, columnKey: Key) => {
      const cellValue =
        itemInstrukturAsesor[columnKey as keyof typeof itemInstrukturAsesor]; // get value of cell by column key

      switch (columnKey) {
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
                  key="detail-instruktur-asesor-button"
                  onPress={() => {
                    setSelectedId(`${itemInstrukturAsesor.id}`);
                    editInstrukturAsesorModal.onOpen();
                  }}
                >
                  Edit Data
                </DropdownItem>

                <DropdownItem
                  key="delete-instruktur-asesor-button"
                  className="text-danger-600"
                  onPress={() => {
                    setSelectedId(`${itemInstrukturAsesor.id}`);
                    deleteInstrukturAsesorModal.onOpen();
                  }}
                >
                  Delete Data
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        case "role":
          return cellValue === "instruktur" ? (
            <span className="capitalize bg-blue-900 rounded-md px-1 text-white">
              {cellValue}
            </span>
          ) : (
            <span className="capitalize bg-green-900 rounded-md px-1 text-white">
              {String(cellValue)}
            </span>
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
          buttonTopContentLabel="Tambah Instruktur/Asesor"
          columns={LIST_KELOLA_INSTRUKTUR_ASESOR}
          data={dataKelolaInstrukturAsesor?.data || []}
          emptyContent="Instruktur/Asesor tidak ditemukan"
          isLoading={
            isLoadingKelolaInstrukturAsesor ||
            isRefetchingKelolaInstrukturAsesor
          }
          renderCell={renderCell}
          totalPages={
            dataKelolaInstrukturAsesor
              ? dataKelolaInstrukturAsesor.pagination.totalPages
              : 1
          }
          onClickButtonTopContent={() => {
            tambahInstrukturAsesorModal.onOpen();
          }}
        />
      )}
      <TambahInstrukturAsesorModal
        {...tambahInstrukturAsesorModal}
        refetchInstrukturAsesor={refetchKelolaInstrukturAsesor}
      />

      <EditInstrukturAsesorModal
        {...editInstrukturAsesorModal}
        refetchInstrukturAsesor={refetchKelolaInstrukturAsesor}
        selectedId={selectedId}
      />

      <DeleteInstrukturAsesorModal
        {...deleteInstrukturAsesorModal}
        refetchInstrukturAsesor={refetchKelolaInstrukturAsesor}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </section>
  );
};

export default KelolaInstrukturAsesor;
