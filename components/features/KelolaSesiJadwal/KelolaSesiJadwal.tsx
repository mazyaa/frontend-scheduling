"use client";

import React, { Key, useCallback, useEffect } from "react";
import { Button } from "@heroui/button";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useSearchParams, useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/modal";
import { IoMdArrowBack } from "react-icons/io";

import useKelolaSesiJadwal from "./useKelolaSesiJadwal";
import { LISTS_KELOLA_SESI_JADWAL } from "./kelolaSesiJadwal.constants";
import TambahSesiModal from "./TambahSesiModal";
import EditSesiModal from "./EditSesiModal";
import DeleteSesiModal from "./DeleteSesiModal";

import { TablePageSkeleton } from "@/components/ui/Skeletons";
import DataTable from "@/components/ui/DataTable/DataTable";
import useChangeUrl from "@/hooks/useChangeUrl";

const KelolaSesiJadwal = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tambahSesiModal = useDisclosure();
  const editSesiModal = useDisclosure();
  const deleteSesiModal = useDisclosure();

  const {
    dataSesiJadwal,
    isLoadingSesiJadwal,
    isRefetchingSesiJadwal,
    refetchSesiJadwal,

    selectedId,
    setSelectedId,
    jadwalId,
  } = useKelolaSesiJadwal();

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const renderCell = useCallback(
    (itemSesi: any, columnKey: Key) => {
      const cellValue = itemSesi[columnKey as keyof typeof itemSesi];

      switch (columnKey) {
        case "jamMulai":
          return <span>{itemSesi.jamMulai}</span>;
        case "jamSelesai":
          return <span>{itemSesi.jamSelesai}</span>;
        case "aktivitas":
          return <span>{itemSesi.aktivitas}</span>;
        case "pic":
          return <span>{itemSesi.pic || "-"}</span>;
        case "aksi":
          return (
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => {
                  setSelectedId(String(itemSesi.id));
                  editSesiModal.onOpen();
                }}
              >
                <FiEdit className="text-secondary" />
              </Button>
              <Button
                isIconOnly
                color="danger"
                size="sm"
                variant="light"
                onPress={() => {
                  setSelectedId(String(itemSesi.id));
                  deleteSesiModal.onOpen();
                }}
              >
                <FiTrash2 />
              </Button>
            </div>
          );
        default:
          return cellValue as React.ReactNode;
      }
    },
    [setSelectedId, editSesiModal, deleteSesiModal],
  );

  return (
    <section>
      <div className="mb-4 flex gap-4">
        <Button
          isIconOnly
          variant="light"
          onPress={() =>
            router.push(`/admin/kelola-jadwal-training/${jadwalId}`)
          }
        >
          <IoMdArrowBack className="text-2xl" />
        </Button>
        <h2 className="text-xl font-bold">Kelola Sesi Jadwal</h2>
      </div>

      <div className="mb-4 flex w-full justify-between items-center">
        <div />
        <Button color="primary" onPress={tambahSesiModal.onOpen}>
          Tambah Sesi Jadwal
        </Button>
      </div>

      {isLoadingSesiJadwal ? (
        <TablePageSkeleton />
      ) : (
        <DataTable
          columns={LISTS_KELOLA_SESI_JADWAL}
          data={dataSesiJadwal?.data || []}
          emptyContent="Sesi Jadwal Tidak Ditemukan"
          isLoading={isLoadingSesiJadwal || isRefetchingSesiJadwal}
          placeholderTopContent="Cari aktivitas..."
          renderCell={renderCell}
          totalPages={dataSesiJadwal ? dataSesiJadwal.pagination.totalPages : 1}
        />
      )}

      <TambahSesiModal
        {...tambahSesiModal}
        refetchSesiJadwal={refetchSesiJadwal}
      />
      <EditSesiModal
        {...editSesiModal}
        refetchSesiJadwal={refetchSesiJadwal}
        selectedId={selectedId}
      />
      <DeleteSesiModal
        {...deleteSesiModal}
        refetchSesiJadwal={refetchSesiJadwal}
        selectedId={selectedId}
      />
    </section>
  );
};

export default KelolaSesiJadwal;
