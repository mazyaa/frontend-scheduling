"use client";

import React, { Key, useCallback, useEffect } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { CiMenuKebab } from "react-icons/ci";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";

import useDetailJadwal from "./useDetailJadwal";
import useNotifikasi from "./useNotifikasi";
import LISTS_DETAIL_KELOLA_JADWAL from "./detailJadwal.constants";
import TambahKeteranganModal from "./TambahKeteranganModal";
import EditDetailJadwalModal from "./EditDetailJadwalModal";

import { TablePageSkeleton } from "@/components/ui/Skeletons";
import DataTable from "@/components/ui/DataTable/DataTable";
import useChangeUrl from "@/hooks/useChangeUrl";

const DetailJadwal = () => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";
  const tambahKeteranganModal = useDisclosure();
  const editDetailJadwalModal = useDisclosure();

  const {
    dataDetailJadwal,
    isLoadiangDetailJadwal,
    isRefetchingDetailJadwal,
    refetchDetailKelolaJadwal,

    selectedId,
    setSelectedId,
  } = useDetailJadwal();

  const { isPendingKirimNotifikasi, handleKirimNotifikasi } = useNotifikasi();

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const renderCell = useCallback(
    (itemDetailJadwal: any, columnKey: Key) => {
      const cellValue =
        itemDetailJadwal[columnKey as keyof typeof itemDetailJadwal];

      switch (columnKey) {
        case "nama_training":
          return (
            <span>
              {itemDetailJadwal?.jadwalTraining?.training?.namaTraining ??
                "Nama training tidak ditemukan"}
            </span>
          );
        case "hari":
          if (!cellValue) return "-";
          const tanggal = new Date(cellValue as string);

          return (
            <span>
              {tanggal.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: "Asia/Jakarta",
              })}
            </span>
          );
        case "nama_instruktur":
          return <span>{itemDetailJadwal.instruktur?.name || "-"}</span>;
        case "nama_asesor":
          return <span>{itemDetailJadwal.asesor?.name || "-"}</span>;
        case "aksi":
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  isDisabled={isPendingKirimNotifikasi}
                  size="sm"
                  variant="light"
                >
                  {isPendingKirimNotifikasi ? (
                    <Spinner className="h-4 w-4" color="default" size="sm" />
                  ) : (
                    <CiMenuKebab className="text-default-700" />
                  )}
                </Button>
              </DropdownTrigger>

              <DropdownMenu>
                <DropdownItem
                  key="Tambah-keterangan-button"
                  onPress={() => {
                    setSelectedId(String(itemDetailJadwal.id));
                    tambahKeteranganModal.onOpen();
                  }}
                >
                  Tambah Keterangan
                </DropdownItem>
                <DropdownItem key="Tambah-sesi-button" onPress={() => {}}>
                  Generate Sesi Otomatis
                </DropdownItem>
                <DropdownItem
                  key="edit-detail-jadwal"
                  onPress={() => {
                    setSelectedId(String(itemDetailJadwal.id));
                    editDetailJadwalModal.onOpen();
                  }}
                >
                  Edit Detail Jadwal
                </DropdownItem>
                <DropdownItem
                  key="kirim-notifikasi-button"
                  isDisabled={isPendingKirimNotifikasi}
                  onPress={() => {
                    handleKirimNotifikasi(String(itemDetailJadwal.id));
                  }}
                >
                  <span className="text-green-600">
                    {isPendingKirimNotifikasi ? (
                      <div className="flex items-center gap-2">
                        <Spinner
                          className="h-4 w-4"
                          color="default"
                          size="sm"
                        />
                        <span>Mengirim Notifikasi...</span>
                      </div>
                    ) : (
                      "Kirim Notifikasi WA"
                    )}
                  </span>
                </DropdownItem>
                <DropdownItem key="kirim-kredensial-buttton" onPress={() => {}}>
                  <span className="text-brand">Kirim kredensial</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue as React.ReactNode;
      }
    },
    [
      setSelectedId,
      tambahKeteranganModal,
      editDetailJadwalModal,
      isPendingKirimNotifikasi,
      handleKirimNotifikasi,
    ],
  );

  return (
    <section>
      {isLoadingSession ? (
        <TablePageSkeleton />
      ) : (
        <DataTable
          columns={LISTS_DETAIL_KELOLA_JADWAL}
          data={dataDetailJadwal?.data || []}
          emptyContent="Detail Jadwal Tidak Ditemukan"
          isLoading={isLoadiangDetailJadwal || isRefetchingDetailJadwal}
          placeholderTopContent="Cari berdasarkan hari ke-"
          renderCell={renderCell}
          totalPages={
            dataDetailJadwal ? dataDetailJadwal.pagination.totalPages : 1
          }
        />
      )}

      <TambahKeteranganModal
        {...tambahKeteranganModal}
        refetchDetailJadwal={refetchDetailKelolaJadwal}
        selectedId={selectedId}
      />
      <EditDetailJadwalModal
        {...editDetailJadwalModal}
        refetchDetailJadwal={refetchDetailKelolaJadwal}
        selectedId={selectedId}
      />
    </section>
  );
};

export default DetailJadwal;
