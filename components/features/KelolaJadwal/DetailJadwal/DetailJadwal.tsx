"use client";

import { useRouter } from "next/navigation";
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

import useDetailJadwal from "./useDetailJadwal";
import LISTS_DETAIL_KELOLA_JADWAL from "./detailJadwal.constants";

import { TablePageSkeleton } from "@/components/ui/Skeletons";
import DataTable from "@/components/ui/DataTable/DataTable";
import useChangeUrl from "@/hooks/useChangeUrl";

const DetailJadwal = () => {
  const router = useRouter();
  // const { push } = router();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";

  const {
    dataDetailJadwal,
    isLoadiangDetailJadwal,
    isRefetchingDetailJadwal,
    // refetchDetailKelolaJadwal,

    selectedId,
    // setSelectedId,

    // isLoadingKelolaTraining,
  } = useDetailJadwal();

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const renderCell = useCallback(
    (itemDetailJadwal: Record<string, unknown>, columnKey: Key) => {
      const cellValue =
        itemDetailJadwal[columnKey as keyof typeof itemDetailJadwal];

      switch (columnKey) {
        case "nama_training":
          return (
            <span>
              {(itemDetailJadwal as any)?.jadwalTraining?.training
                ?.namaTraining ?? "Nama training tidak ditemukan"}
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
          if (!cellValue) return "-";
        case "nama_asesor":
          if (!cellValue) return "-";
        case "aksi":
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <CiMenuKebab className="text-default-700" />
                </Button>
              </DropdownTrigger>

              <DropdownMenu>
                <DropdownItem key="Tambah-keterangan-button" onPress={() => {}}>
                  Tambah Keterangan
                </DropdownItem>
                <DropdownItem key="Tambah-sesi-button" onPress={() => {}}>
                  Generate Sesi Otomatis
                </DropdownItem>
                <DropdownItem key="edit-detail-jadwal" onPress={() => {}}>
                  Edit Detail Jadwal
                </DropdownItem>
                <DropdownItem key="kirim-notifikasi-button" onPress={() => {}}>
                  <span className="text-green-600">Kirim Notifikasi WA</span>
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
    [router, selectedId],
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
          placeholderTopContent="Cari Jadwal berdasarkan nama training..."
          renderCell={renderCell}
          totalPages={
            dataDetailJadwal ? dataDetailJadwal.pagination.totalPages : 1
          }
        />
      )}
    </section>
  );
};

export default DetailJadwal;
