"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Key, useCallback, useEffect } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { CiMenuKebab } from "react-icons/ci";
import { useSession } from "next-auth/react";

import useKelolaJadwal from "./useKelolaJadwal";
import LISTS_KELOLA_JADWAL from "./kelolaJadwal.constants";

import useChangeUrl from "@/hooks/useChangeUrl";
import DataTable from "@/components/ui/DataTable/DataTable";
import { TablePageSkeleton } from "@/components/ui/Skeletons";

const KelolaJadwal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";

  const {
    dataKelolaJadwal,
    isLoadingKelolaJadwal,
    isRefetchingKelolaJadwal,
    // refetchKelolaJadwal,
    // selectedId,
    setSelectedId,

    dataKelolaTraining,
  } = useKelolaJadwal();

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const renderCell = useCallback(
    (itemJadwal: Record<string, unknown>, columnKey: Key) => {
      const cellValue = itemJadwal[columnKey as keyof typeof itemJadwal];

      switch (columnKey) {
        case "nama_training":
          const namaTraining = dataKelolaTraining?.data.find(
            (training: any) =>
              String(training.id) === String(itemJadwal.trainingId),
          );

          return (
            <span>
              {namaTraining
                ? namaTraining.namaTraining
                : "Nama training tidak ditemukan"}
            </span>
          );
        case "tanggal_mulai":
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
        case "durasi_training":
          return <span>{cellValue as string} HARI</span>;
        case "aksi":
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <CiMenuKebab className="text-default-700" />
                </Button>
              </DropdownTrigger>

              <DropdownMenu>
                <DropdownItem key="detail-jadwal-button" onPress={() => {}}>
                  Detail Jadwal
                </DropdownItem>
                <DropdownItem
                  key="detail-jadwal-button"
                  className="text-green-700"
                  onPress={() => {}}
                >
                  Edit Jadwal
                </DropdownItem>
                <DropdownItem
                  key="detail-jadwal-button"
                  className="text-red-700"
                  onPress={() => {}}
                >
                  Delete Jadwal
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue as React.ReactNode;
      }
    },
    [router, setSelectedId, dataKelolaTraining],
  );

  return (
    <section>
      {isLoadingSession ? (
        <TablePageSkeleton />
      ) : (
        <DataTable
          buttonTopContentLabel="Tambah Jadwal"
          columns={LISTS_KELOLA_JADWAL}
          data={dataKelolaJadwal?.data || []}
          emptyContent="Jadwal tidak ditemukan"
          isLoading={
            isLoadingKelolaJadwal ||
            isRefetchingKelolaJadwal ||
            !dataKelolaTraining
          }
          placeholderTopContent="Cari Jadwal berdasarkan nama training..."
          renderCell={renderCell}
          totalPages={
            dataKelolaJadwal ? dataKelolaJadwal.pagination.totalPages : 1
          }
          onClickButtonTopContent={() => {}}
        />
      )}
    </section>
  );
};

export default KelolaJadwal;
