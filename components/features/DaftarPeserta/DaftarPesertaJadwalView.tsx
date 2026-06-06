"use client";

import { useSearchParams } from "next/navigation";
import { Key, useCallback, useEffect } from "react";
import { Button } from "@heroui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaArrowLeftLong, FaUsers } from "react-icons/fa6";

import useMyJadwalTraining from "@/components/features/MyJadwalTraining/useMyJadwalTraining";
import LISTS_MY_JADWAL_TRAINING from "@/components/features/MyJadwalTraining/myJadwalTraining.constants";

import useChangeUrl from "@/hooks/useChangeUrl";
import DataTable from "@/components/ui/DataTable/DataTable";
import { TablePageSkeleton } from "@/components/ui/Skeletons";

interface PropTypes {
  onSelectJadwal: (jadwalTrainingId: string) => void;
}

const DaftarPesertaJadwalView = ({ onSelectJadwal }: PropTypes) => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";

  const { dataMyJadwal, isLoadingMyJadwal, isRefetchingMyJadwal } =
    useMyJadwalTraining();

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const renderCell = useCallback(
    (itemJadwal: Record<string, unknown>, columnKey: Key) => {
      const cellValue = itemJadwal[columnKey as keyof typeof itemJadwal];

      switch (columnKey) {
        case "namaTraining":
          return <span>{cellValue as string}</span>;
        case "startDate":
        case "endDate":
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
        case "batch":
          return <span>{cellValue as string}</span>;
        case "aksi":
          return (
            <Button
              className="bg-brand text-white text-xs h-8"
              size="sm"
              startContent={<FaUsers size={13} />}
              onPress={() => onSelectJadwal(itemJadwal.id as string)}
            >
              Detail Peserta
            </Button>
          );
        default:
          return cellValue as React.ReactNode;
      }
    },
    [onSelectJadwal],
  );

  return (
    <section className="w-full max-w-6xl mx-auto px-4 z-10">
      <div className="mb-6">
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
          Daftar Peserta
        </h1>
        <p>Pilih jadwal training untuk melihat daftar peserta.</p>
      </div>

      {isLoadingSession ? (
        <TablePageSkeleton />
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <DataTable
            columns={LISTS_MY_JADWAL_TRAINING}
            data={dataMyJadwal?.data || []}
            emptyContent="Jadwal training tidak ditemukan"
            isLoading={isLoadingMyJadwal || isRefetchingMyJadwal}
            placeholderTopContent="Cari..."
            renderCell={renderCell}
            totalPages={
              dataMyJadwal ? dataMyJadwal.pagination?.totalPages || 1 : 1
            }
          />
        </div>
      )}
    </section>
  );
};

export default DaftarPesertaJadwalView;
