"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Key, ReactNode, useCallback, useEffect } from "react";
import { Button } from "@heroui/button";
import { useSession } from "next-auth/react";
import { useDisclosure } from "@heroui/modal";
import { cn } from "@heroui/theme";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";

import { LIST_KELOLA_INSTRUKTUR_ASESOR } from "./kelolaInstrukturAsesor.constants";
import useKelolaInstrukturAsesor from "./useKelolaInstrukturAsesor";
import TambahInstrukturAsesorModal from "./TambahInstrukturAsesorModal";
import { EditInstrukturAsesorModal } from "./EditInstrukturAsesorModal";
import { DeleteInstrukturAsesorModal } from "./DeleteInstrukturAsesorModal";
import DetailInstrukturAsesorModal from "./DetailInstrukturAsesorModal/DetailInstrukturAsesorModal";

import useChangeUrl from "@/hooks/useChangeUrl";
import { CardMapSkeleton } from "@/components/ui/Skeletons";
import CardTable from "@/components/ui/Card";

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
  const detailInstrukturAsesorModal = useDisclosure();

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
                  setSelectedId(String(itemInstrukturAsesor.id));
                  detailInstrukturAsesorModal.onOpen();
                }}
              >
                <FiEye size={13} />
                Detail
              </Button>

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
                  setSelectedId(String(itemInstrukturAsesor.id));
                  editInstrukturAsesorModal.onOpen();
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
                  setSelectedId(String(itemInstrukturAsesor.id));
                  deleteInstrukturAsesorModal.onOpen();
                }}
              >
                <FiTrash2 size={13} />
                Delete
              </Button>
            </div>
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
        <CardMapSkeleton />
      ) : (
        <CardTable
          buttonTopContentLabel="Tambah Instruktur/Asesor"
          columns={LIST_KELOLA_INSTRUKTUR_ASESOR}
          data={dataKelolaInstrukturAsesor?.data || []}
          emptyContent="Instruktur/Asesor tidak ditemukan"
          isLoading={
            isLoadingKelolaInstrukturAsesor ||
            isRefetchingKelolaInstrukturAsesor
          }
          placeholderTopContent="Cari Instruktur atau Asesor..."
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

      <DetailInstrukturAsesorModal
        {...detailInstrukturAsesorModal}
        columns={LIST_KELOLA_INSTRUKTUR_ASESOR}
        renderCell={renderCell}
        selectedId={selectedId}
      />
    </section>
  );
};

export default KelolaInstrukturAsesor;
