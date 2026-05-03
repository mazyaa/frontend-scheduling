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
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";

import useDetailJadwal from "./useDetailJadwal";
import useNotifikasi from "./useNotifikasi";
import LISTS_DETAIL_KELOLA_JADWAL from "./detailJadwal.constants";
import TambahKeteranganModal from "./TambahKeteranganModal";
import EditDetailJadwalModal from "./EditDetailJadwalModal";
import useGenerateSesiOtomatis from "./useGenerateSesiOtomatis";

import { TablePageSkeleton } from "@/components/ui/Skeletons";
import DataTable from "@/components/ui/DataTable/DataTable";
import useChangeUrl from "@/hooks/useChangeUrl";

const DetailJadwal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: jadwalId } = useParams() as { id: string };
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
  const { handleGenerateSesiOtomatis, isPendingGenerateSesi } =
    useGenerateSesiOtomatis();

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
                <DropdownItem
                  key="Tambah-sesi-button"
                  className={
                    !itemDetailJadwal.instruktur && !itemDetailJadwal.asesor
                      ? "text-gray-400"
                      : ""
                  }
                  isDisabled={
                    (!itemDetailJadwal.instruktur &&
                      !itemDetailJadwal.asesor) ||
                    isPendingGenerateSesi
                  }
                  onPress={() => {
                    setSelectedId(String(itemDetailJadwal.id));
                    handleGenerateSesiOtomatis(String(itemDetailJadwal.id));
                  }}
                >
                  <span
                    className={
                      !itemDetailJadwal.instruktur && !itemDetailJadwal.asesor
                        ? "text-gray-400"
                        : ""
                    }
                  >
                    {isPendingGenerateSesi &&
                    selectedId === String(itemDetailJadwal.id) ? (
                      <div className="flex items-center gap-2">
                        <Spinner
                          className="h-4 w-4"
                          color="default"
                          size="sm"
                        />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      "Generate Sesi Otomatis"
                    )}
                  </span>
                </DropdownItem>
                <DropdownItem
                  key="lihat-detail-sesi"
                  className={
                    !itemDetailJadwal.instruktur && !itemDetailJadwal.asesor
                      ? "text-gray-400"
                      : ""
                  }
                  isDisabled={
                    !itemDetailJadwal.instruktur && !itemDetailJadwal.asesor
                  }
                  onPress={() => {
                    const url = `/admin/kelola-jadwal-training/${jadwalId}/sesi/${itemDetailJadwal.id}?limit=8&page=1`;

                    router.push(url);
                  }}
                >
                  Lihat Detail Sesi
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
      handleGenerateSesiOtomatis,
      isPendingGenerateSesi,
      selectedId,
      jadwalId,
      router,
    ],
  );

  return (
    <section>
      <div className="flex text-sm flex-row border-1 items-center border-brand justify-center rounded-2xl my-5 w-fit hover:bg-brand/10">
        <Link
          className="flex flex-row items-center gap-2 py-2 px-4 group"
          href="/admin/kelola-jadwal-training"
        >
          <FaArrowLeftLong className="text-brand transition-transform duration-300 group-hover:-translate-x-1" />
          <p className="text-brand font-medium transition-transform duration-300 group-hover:scale-105">
            Kembali Ke -{" "}
            <span className="text-white bg-brand rounded-xl p-1.5 inline-block transition-transform duration-300 group-hover:scale-105">
              Jadwal Training
            </span>
          </p>
        </Link>
      </div>
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
