"use client";

import { useSearchParams } from "next/navigation";
import { Key, useCallback, useEffect, useMemo } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { CiMenuKebab } from "react-icons/ci";
import { useDisclosure } from "@heroui/modal";
import { useSession } from "next-auth/react";
import { Select, SelectItem } from "@heroui/select";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";

import useKelolaPenilaian from "./useKelolaPenilaian";
import LISTS_KELOLA_PENILAIAN from "./penilaian.constants";
import TambahPenilaianModal from "./TambahPenilaianModal/TambahPenilaianModal";
import EditPenilaianModal from "./EditPenilaianModal/EditPenilaianModal";
import DeletePenilaianModal from "./DeletePenilaianModal/DeletePenilaianModal";

import useChangeUrl from "@/hooks/useChangeUrl";
import DataTable from "@/components/ui/DataTable/DataTable";
import { TablePageSkeleton } from "@/components/ui/Skeletons";

interface KelolaPenilaianProps {
  scheduleId?: string;
  isGridUI?: boolean;
}

const KelolaPenilaian = ({
  scheduleId,
  isGridUI = false,
}: KelolaPenilaianProps) => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";

  const {
    dataKelolaPenilaian,
    isLoadingKelolaPenilaian,
    isRefetchingKelolaPenilaian,
    refetchKelolaPenilaian,
    selectedId,
    setSelectedId,
    selectedJadwalTrainingId,
    setSelectedJadwalTrainingId,
    dataFilterJadwal,
    isLoadingFilterJadwal,
  } = useKelolaPenilaian(scheduleId);

  const tambahPenilaianModal = useDisclosure();
  const editPenilaianModal = useDisclosure();
  const deletePenilaianModal = useDisclosure();

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const customTopContent = useMemo(() => {
    if (scheduleId) return null;

    return (
      <Select
        disallowEmptySelection
        className="w-full sm:max-w-[200px]"
        label="Filter Jadwal"
        selectedKeys={
          selectedJadwalTrainingId ? [selectedJadwalTrainingId] : ["__all__"]
        }
        size="sm"
        variant="bordered"
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0] as string;

          setSelectedJadwalTrainingId(key === "__all__" ? "" : key);
        }}
      >
        <SelectItem key="__all__" className="text-sm" textValue="Semua Jadwal">
          Semua Jadwal
        </SelectItem>
        {isLoadingFilterJadwal ? (
          <SelectItem key="loading" className="text-sm" textValue="Loading...">
            Loading...
          </SelectItem>
        ) : (
          (dataFilterJadwal || []).map((jadwal: any) => (
            <SelectItem
              key={jadwal.id}
              className="text-sm"
              textValue={`${jadwal.training?.namaTraining || "Tanpa Nama"} - ${jadwal.batch}`}
            >
              {jadwal.training?.namaTraining || "Tanpa Nama"} - {jadwal.batch}
            </SelectItem>
          ))
        )}
      </Select>
    );
  }, [
    scheduleId,
    selectedJadwalTrainingId,
    setSelectedJadwalTrainingId,
    dataFilterJadwal,
    isLoadingFilterJadwal,
  ]);

  const renderCell = useCallback(
    (itemPenilaian: Record<string, unknown>, columnKey: Key) => {
      const cellValue = itemPenilaian[columnKey as keyof typeof itemPenilaian];

      const itemId =
        (itemPenilaian as any)?.penilaianId || (itemPenilaian as any)?.id;

      switch (columnKey) {
        case "namaPeserta":
          return (itemPenilaian as any)?.namaPeserta || "-";
        case "jadwalTraining":
          const trainingLabel = (itemPenilaian as any)?.training;
          const batchLabel = (itemPenilaian as any)?.batch;

          return trainingLabel ? `${trainingLabel} - ${batchLabel || ""}` : "-";
        case "statusKompetensi":
          const status = cellValue as string;

          return (
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                status === "kompeten"
                  ? "bg-success-100 text-success-700"
                  : "bg-warning-100 text-warning-700"
              }`}
            >
              {status === "kompeten" ? "Kompeten" : "Belum Kompeten"}
            </span>
          );
        case "catatan":
          return cellValue || "-";
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
                  key="edit-penilaian-button"
                  className="text-green-700"
                  onPress={() => {
                    if (itemId) {
                      setSelectedId(itemId);
                      editPenilaianModal.onOpen();
                    }
                  }}
                >
                  Edit Penilaian
                </DropdownItem>
                <DropdownItem
                  key="delete-penilaian-button"
                  className="text-red-700"
                  onPress={() => {
                    if (itemId) {
                      setSelectedId(itemId);
                      deletePenilaianModal.onOpen();
                    }
                  }}
                >
                  Delete Penilaian
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue as React.ReactNode;
      }
    },
    [editPenilaianModal, deletePenilaianModal, setSelectedId],
  );

  return (
    <section className={isGridUI ? "w-full max-w-6xl mx-auto px-4 z-10" : ""}>
      {isGridUI && (
        <div className="mb-6 z-[999]">
          <div className="flex text-sm flex-row border-1 items-center border-brand justify-center rounded-2xl my-5 w-fit hover:bg-brand/10">
            <Link
              className="flex flex-row items-center gap-2 py-2 px-4 group"
              href="/"
            >
              <FaArrowLeftLong className="text-brand transition-transform duration-300 group-hover:-translate-x-1" />
              <p className="text-brand font-medium transition-transform duration-300 group-hover:scale-105">
                Kembali Ke -{" "}
                <span className="text-white bg-brand rounded-xl p-1.5 inline-block transition-transform duration-300 group-hover:scale-105">
                  Beranda
                </span>
              </p>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-brand mb-2">
            Kelola Penilaian
          </h1>
          <p>Kelola penilaian peserta untuk setiap sesi training.</p>
        </div>
      )}
      {isLoadingSession ? (
        <TablePageSkeleton />
      ) : (
        <>
          <DataTable
            buttonTopContentLabel="Tambah Penilaian"
            columns={LISTS_KELOLA_PENILAIAN}
            customTopContent={customTopContent}
            data={dataKelolaPenilaian?.data || []}
            emptyContent="Penilaian tidak ditemukan"
            isLoading={isLoadingKelolaPenilaian || isRefetchingKelolaPenilaian}
            placeholderTopContent="Cari Berdasarkan Nama Peserta..."
            renderCell={renderCell}
            totalPages={
              dataKelolaPenilaian
                ? dataKelolaPenilaian.pagination.totalPages
                : 1
            }
            onClickButtonTopContent={() => tambahPenilaianModal.onOpen()}
          />

          <TambahPenilaianModal
            {...tambahPenilaianModal}
            refetchKelolaPenilaian={refetchKelolaPenilaian}
          />
          <EditPenilaianModal
            {...editPenilaianModal}
            currentData={dataKelolaPenilaian?.data || []}
            refetchKelolaPenilaian={refetchKelolaPenilaian}
            selectedId={selectedId}
          />
          <DeletePenilaianModal
            {...deletePenilaianModal}
            refetchKelolaPenilaian={refetchKelolaPenilaian}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </>
      )}
    </section>
  );
};

export default KelolaPenilaian;
