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
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";

import useDetailJadwal from "./useDetailJadwal";
import LISTS_MY_DETAIL_JADWAL from "./detailJadwal.constants";

import useChangeUrl from "@/hooks/useChangeUrl";
import DataTable from "@/components/ui/DataTable/DataTable";
import { TablePageSkeleton } from "@/components/ui/Skeletons";

interface PropTypes {
  role: string;
}

const DetailJadwal = ({ role }: PropTypes) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";

  const {
    dataDetailJadwal,
    isLoadingDetailJadwal,
    isRefetchingDetailJadwal,
    jadwalTrainingId,
  } = useDetailJadwal();

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const renderCell = useCallback(
    (itemDetail: Record<string, unknown>, columnKey: Key) => {
      const cellValue = itemDetail[columnKey as keyof typeof itemDetail];

      switch (columnKey) {
        case "nama_training":
          return (
            <span>
              {(itemDetail as any)?.jadwalTraining?.training?.namaTraining || (itemDetail as any)?.jadwalTraining?.training ||
                "-"}
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
          return <span>{(itemDetail as any)?.instruktur?.name || "-"}</span>;
        case "nama_asesor":
          return <span>{(itemDetail as any)?.asesor?.name || "-"}</span>;
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
                  key="lihat-detail-sesi"
                  onPress={() => {
                    router.push(
                      `/${role}/jadwal-training/${jadwalTrainingId}/sesi/${itemDetail.id}?limit=8&page=1`,
                    );
                  }}
                >
                  Lihat Detail Sesi
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue as React.ReactNode;
      }
    },
    [role, jadwalTrainingId, router],
  );

  return (
    <section>
      <div className="mb-6">
        <div className="flex text-sm flex-row border-1 items-center border-brand justify-center rounded-2xl my-5 w-fit hover:bg-brand/10">
          <Link
            className="flex flex-row items-center gap-2 py-2 px-4 group"
            href={`/${role}/jadwal-training?limit=8&page=1`}
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
        <h1 className="text-3xl font-bold text-brand mb-2">
          Detail Jadwal Training
        </h1>
        <p>Detail Jadwal Training yang sudah anda ikuti.</p>
      </div>

      {isLoadingSession ? (
        <TablePageSkeleton />
      ) : (
        <DataTable
          columns={LISTS_MY_DETAIL_JADWAL}
          data={dataDetailJadwal?.data || []}
          emptyContent="Detail jadwal tidak ditemukan"
          isLoading={isLoadingDetailJadwal || isRefetchingDetailJadwal}
          placeholderTopContent="Cari berdasarkan hari ke-"
          renderCell={renderCell}
          totalPages={
            dataDetailJadwal ? dataDetailJadwal.pagination?.totalPages || 1 : 1
          }
        />
      )}
    </section>
  );
};

export default DetailJadwal;
