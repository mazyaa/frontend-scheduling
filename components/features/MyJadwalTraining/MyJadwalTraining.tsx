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

import useMyJadwalTraining from "./useMyJadwalTraining";
import LISTS_MY_JADWAL_TRAINING from "./myJadwalTraining.constants";

import useChangeUrl from "@/hooks/useChangeUrl";
import DataTable from "@/components/ui/DataTable/DataTable";
import { TablePageSkeleton } from "@/components/ui/Skeletons";

interface PropTypes {
  role: string;
  isGridUI?: boolean;
}

const MyJadwalTraining = ({ role, isGridUI = false }: PropTypes) => {
  const router = useRouter();
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
        case "nama_training":
          return (
            <span>
              {(itemJadwal as any).namaTraining ??
                "Nama training tidak ditemukan"}
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
                <DropdownItem
                  key="detail-jadwal-button"
                  onPress={() => {
                    router.push(
                      `/${role}/jadwal-training/${itemJadwal.id}?limit=8&page=1`,
                    );
                  }}
                >
                  Detail Jadwal
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue as React.ReactNode;
      }
    },
    [role, router],
  );

  return (
    <section className={isGridUI ? "w-full max-w-6xl mx-auto px-4 z-10" : ""}>
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
        <h1 className="text-3xl font-bold text-brand mb-2">Jadwal Training</h1>
        <p>Daftar jadwal training yang Anda ikuti.</p>
      </div>

      {isLoadingSession ? (
        <TablePageSkeleton />
      ) : (
        <DataTable
          columns={LISTS_MY_JADWAL_TRAINING}
          data={dataMyJadwal?.data || []}
          emptyContent="Jadwal training tidak ditemukan"
          isLoading={isLoadingMyJadwal || isRefetchingMyJadwal}
          placeholderTopContent="Cari jadwal training..."
          renderCell={renderCell}
          totalPages={
            dataMyJadwal ? dataMyJadwal.pagination?.totalPages || 1 : 1
          }
        />
      )}
    </section>
  );
};

export default MyJadwalTraining;
