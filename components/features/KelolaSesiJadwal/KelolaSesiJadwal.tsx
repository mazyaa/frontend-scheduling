"use client";

import React, { Key, useCallback, useEffect } from "react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useSearchParams, usePathname } from "next/navigation";
import { useDisclosure } from "@heroui/modal";
import { CiMenuKebab } from "react-icons/ci";
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";

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
  const pathname = usePathname();
  const id = pathname.split("/")[3];

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
        case "pic": {
          let picName = itemSesi.pic || "-";
          let bgClass = "";

          if (itemSesi.pic?.toLowerCase().includes("instruktur")) {
            picName =
              itemSesi.detailJadwalTraining?.instruktur?.name || picName;
            bgClass = "bg-blue-500 text-white px-2 py-1 rounded-md";
          } else if (itemSesi.pic?.toLowerCase().includes("asesor")) {
            picName = itemSesi.detailJadwalTraining?.asesor?.name || picName;
            bgClass = "bg-green-500 text-white px-2 py-1 rounded-md";
          }

          return (
            <div className="flex text-center">
              <span className={bgClass}>{picName}</span>
            </div>
          );
        }
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
      <div className="flex text-sm flex-row border-1 items-center border-brand justify-center rounded-2xl my-5 w-fit hover:bg-brand/10">
        <Link
          className="flex flex-row items-center gap-2 py-2 px-4 group"
          href={`/admin/kelola-jadwal-training/${id}`}
        >
          <FaArrowLeftLong className="text-brand transition-transform duration-300 group-hover:-translate-x-1" />
          <p className="text-brand font-medium transition-transform duration-300 group-hover:scale-105">
            Kembali Ke -{" "}
            <span className="text-white bg-brand rounded-xl p-1.5 inline-block transition-transform duration-300 group-hover:scale-105">
              Detail Jadwal
            </span>
          </p>
        </Link>
      </div>
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
          onClickButtonTopContent={tambahSesiModal.onOpen}
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
