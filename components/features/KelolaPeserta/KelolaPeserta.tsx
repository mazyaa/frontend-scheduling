"use client";

import { useSearchParams } from "next/navigation";
import { Key, ReactNode, useCallback, useEffect } from "react";
import { Button } from "@heroui/button";
import { useSession } from "next-auth/react";
import { useDisclosure } from "@heroui/modal";
import { cn } from "@heroui/theme";
import { FiEdit2, FiEye, FiTrash2, FiUploadCloud } from "react-icons/fi";
import { IoIosSend } from "react-icons/io";

import { LIST_KELOLA_PESERTA } from "./kelolaPeserta.constants";
import useKelolaPeserta from "./useKelolaPeserta";
import useKirimKredensial from "./useKirimKredensial";
import ImportPesertaModal from "./ImportPesertaModal";
import TambahPesertaModal from "./TambahPesertaModal";
import EditPesertaModal from "./EditPesertaModal";
import DeletePesertaModal from "./DeletePesertaModal";
import DetailPesertaModal from "./DetailPesertaModal";

import useChangeUrl from "@/hooks/useChangeUrl";
import { CardMapSkeleton } from "@/components/ui/Skeletons";
import CardTable from "@/components/ui/Card";

const KelolaPeserta = () => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";

  const {
    dataKelolaPeserta,
    isLoadingKelolaPeserta,
    isRefetchingKelolaPeserta,
    refetchKelolaPeserta,
    // selectedId,
    setSelectedId,
    selectedData,
    setSelectedData,
  } = useKelolaPeserta();

  const { handleKirimKredensial } = useKirimKredensial();

  const { setUrl } = useChangeUrl();

  const importPesertaModal = useDisclosure();
  const tambahPesertaModal = useDisclosure();
  const editPesertaModal = useDisclosure();
  const deletePesertaModal = useDisclosure();
  const detailPesertaModal = useDisclosure();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const renderCell = useCallback(
    (itemPeserta: Record<string, unknown>, columnKey: Key) => {
      const cellValue = itemPeserta[columnKey as keyof typeof itemPeserta];

      switch (columnKey) {
        case "aksi":
          return (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 w-full max-w-[300px] mx-auto">
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
                  setSelectedData(itemPeserta as any);
                  detailPesertaModal.onOpen();
                }}
              >
                <FiEye size={13} />
                Detail
              </Button>

              <Button
                className={cn(
                  "h-8 px-3 rounded-lg font-medium text-xs",
                  "flex items-center gap-1.5",
                  "bg-orange-50 hover:bg-orange-100",
                  "text-orange-600 hover:text-orange-700",
                  "border border-orange-100 hover:border-orange-200",
                  "transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  "shadow-sm hover:shadow-md",
                )}
                size="sm"
                variant="flat"
                onPress={() => {
                  if (itemPeserta.id) {
                    handleKirimKredensial(itemPeserta.id as string);
                  }
                }}
              >
                <IoIosSend size={13} />
                Kirim Kredensial
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
                  setSelectedData(itemPeserta as any);
                  editPesertaModal.onOpen();
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
                  setSelectedData(itemPeserta as any);
                  deletePesertaModal.onOpen();
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
    [
      setSelectedId,
      setSelectedData,
      detailPesertaModal,
      editPesertaModal,
      deletePesertaModal,
      handleKirimKredensial,
    ],
  );

  return (
    <section>
      {isLoadingSession ? (
        <CardMapSkeleton />
      ) : (
        <CardTable
          buttonTopContentLabel="Tambah Peserta"
          columns={LIST_KELOLA_PESERTA}
          data={dataKelolaPeserta?.data || []}
          emptyContent="Peserta tidak ditemukan"
          extraTopContent={
            <Button
              className="bg-green-600 text-white"
              startContent={<FiUploadCloud />}
              onPress={() => importPesertaModal.onOpen()}
            >
              Import Peserta
            </Button>
          }
          isLoading={isLoadingKelolaPeserta || isRefetchingKelolaPeserta}
          placeholderTopContent="Cari Peserta..."
          renderCell={renderCell}
          totalPages={
            dataKelolaPeserta ? dataKelolaPeserta.pagination.totalPages : 1
          }
          onClickButtonTopContent={() => {
            tambahPesertaModal.onOpen();
          }}
        />
      )}

      {/* Put Modals Here */}
      <ImportPesertaModal
        {...importPesertaModal}
        refetchPeserta={refetchKelolaPeserta}
      />
      <TambahPesertaModal
        {...tambahPesertaModal}
        refetchPeserta={refetchKelolaPeserta}
      />
      <EditPesertaModal
        {...editPesertaModal}
        refetchPeserta={refetchKelolaPeserta}
        selectedData={selectedData}
      />
      <DeletePesertaModal
        {...deletePesertaModal}
        refetchPeserta={refetchKelolaPeserta}
        selectedData={selectedData}
      />
      <DetailPesertaModal {...detailPesertaModal} selectedData={selectedData} />
    </section>
  );
};

export default KelolaPeserta;
