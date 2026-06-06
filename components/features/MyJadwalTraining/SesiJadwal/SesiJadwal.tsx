"use client";

import { useSearchParams } from "next/navigation";
import { Key, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";

import useSesiJadwal from "./useSesiJadwal";
import LISTS_MY_SESI_JADWAL from "./sesiJadwal.constants";

import useChangeUrl from "@/hooks/useChangeUrl";
import DataTable from "@/components/ui/DataTable/DataTable";
import { TablePageSkeleton } from "@/components/ui/Skeletons";

interface PropTypes {
  role: string;
}

const SesiJadwal = ({ role }: PropTypes) => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";

  const {
    dataSesiJadwal,
    isLoadingSesiJadwal,
    isRefetchingSesiJadwal,
    jadwalId,
  } = useSesiJadwal();

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const renderCell = useCallback(
    (itemSesi: Record<string, unknown>, columnKey: Key) => {
      const cellValue = itemSesi[columnKey as keyof typeof itemSesi];

      switch (columnKey) {
        case "pic": {
          let picName = (cellValue as string) || "-";
          let bgClass = "";

          if ((cellValue as string)?.toLowerCase().includes("instruktur")) {
            picName = (itemSesi as any)?.detailJadwalTraining?.instruktur?.name;
            bgClass = "bg-blue-500 text-white px-2 py-1 rounded-md";
          } else if ((cellValue as string)?.toLowerCase().includes("asesor")) {
            picName = (itemSesi as any)?.detailJadwalTraining?.asesor?.name;
            bgClass = "bg-green-500 text-white px-2 py-1 rounded-md";
          } else {
            picName = (cellValue as string) || "-";
            bgClass = "bg-gray-500 text-white px-2 py-1 rounded-md";
          }

          return (
            <div className="flex text-center">
              <span className={bgClass}>{picName}</span>
            </div>
          );
        }
        default:
          return cellValue as React.ReactNode;
      }
    },
    [],
  );

  return (
    <section>
      <div className="mb-6">
        <div className="flex text-sm flex-row border-1 items-center border-brand justify-center rounded-2xl my-5 w-fit hover:bg-brand/10">
          <Link
            className="flex flex-row items-center gap-2 py-2 px-4 group"
            href={`/${role}/jadwal-training/${jadwalId}?limit=8&page=1`}
          >
            <FaArrowLeftLong className="text-brand transition-transform duration-300 group-hover:-translate-x-1" />
            <p className="text-brand font-medium transition-transform duration-300 group-hover:scale-105">
              Kembali Ke -{" "}
              <span className="text-white bg-brand rounded-xl p-1.5 inline-block transition-transform duration-300 group-hover:scale-105">
                Detail Jadwal Training
              </span>
            </p>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-brand mb-2">
          Detail Sesi Jadwal Training
        </h1>
        <p>Detail sesi pada Jadwal Training yang sudah anda ikuti.</p>
      </div>

      {isLoadingSession ? (
        <TablePageSkeleton />
      ) : (
        <DataTable
          columns={LISTS_MY_SESI_JADWAL}
          data={dataSesiJadwal?.data || []}
          emptyContent="Sesi jadwal tidak ditemukan"
          isLoading={isLoadingSesiJadwal || isRefetchingSesiJadwal}
          placeholderTopContent="Cari Aktivitas..."
          renderCell={renderCell}
          totalPages={
            dataSesiJadwal ? dataSesiJadwal.pagination?.totalPages || 1 : 1
          }
        />
      )}
    </section>
  );
};

export default SesiJadwal;
