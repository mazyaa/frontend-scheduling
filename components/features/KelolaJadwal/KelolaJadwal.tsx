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
import { useDisclosure } from "@heroui/modal";

import useKelolaJadwal from "./useKelolaJadwal";
import LISTS_KELOLA_JADWAL from "./kelolaJadwal.constants";
import TambahJadwalModal from "./TambahJadwalModal/TambahJadwalModal";
import EditJadwalModal from "./EditJadwalModal";

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
    refetchKelolaJadwal,
    selectedId,
    setSelectedId,

    dataKelolaTraining,
  } = useKelolaJadwal();

  const tambahJadwalTraining = useDisclosure();
  const editJadwalTraining = useDisclosure();

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
        case "startDate":
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
        case "duration":
          return <span>{cellValue as string} HARI</span>;
        case "meetingLink":
          return (
            <span className="text-blue-700 underline cursor-pointer">
              <a
                href={cellValue as string}
                rel="noopener noreferrer"
                target="_blank"
              >
                {cellValue as string}
              </a>
            </span>
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
                <DropdownItem key="detail-jadwal-button" onPress={() => {}}>
                  Detail Jadwal
                </DropdownItem>
                <DropdownItem
                  key="edit-jadwal-button"
                  className="text-green-700"
                  onPress={() => {
                    setSelectedId(String(itemJadwal.id));
                    editJadwalTraining.onOpen();
                  }}
                >
                  Edit Jadwal
                </DropdownItem>
                <DropdownItem
                  key="delete-jadwal-button"
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
          onClickButtonTopContent={() => {
            tambahJadwalTraining.onOpen();
          }}
        />
      )}
      <TambahJadwalModal
        {...tambahJadwalTraining}
        refetchJadwalTraining={refetchKelolaJadwal}
      />

      <EditJadwalModal
        {...editJadwalTraining}
        refetchJadwalTraining={refetchKelolaJadwal}
        selectedId={selectedId}
      />
    </section>
  );
};

export default KelolaJadwal;
