"use client";

import React, { Key, useCallback, useEffect } from "react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useSearchParams } from "next/navigation";
import { useDisclosure } from "@heroui/modal";
import { CiMenuKebab } from "react-icons/ci";

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
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <CiMenuKebab className="text-default-700" />
                </Button>
              </DropdownTrigger>

              <DropdownMenu>
                <DropdownItem
                  key="edit-sesi-button"
                  className="text-green-700"
                  onPress={() => {
                    setSelectedId(String(itemSesi.id));
                    editSesiModal.onOpen();
                  }}
                >
                  Edit Sesi
                </DropdownItem>
                <DropdownItem
                  key="delete-sesi-button"
                  className="text-red-700"
                  onPress={() => {
                    setSelectedId(String(itemSesi.id));
                    deleteSesiModal.onOpen();
                  }}
                >
                  Delete Sesi
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue as React.ReactNode;
      }
    },
    [setSelectedId, editSesiModal, deleteSesiModal],
  );

  return (
    <section>
      {isLoadingSesiJadwal ? (
        <TablePageSkeleton />
      ) : (
        <DataTable
          buttonTopContentLabel="Tambah Sesi Jadwal"
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
