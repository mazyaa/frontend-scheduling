"use client";

import { useSearchParams } from "next/navigation";
import { Key, useCallback, useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { CiMenuKebab } from "react-icons/ci";
import { useDisclosure } from "@heroui/modal";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import Image from "next/image";

import useStatusKompetensi from "./useStatusKompetensi";
import UploadRevisiPesertaModal from "./UploadRevisiPesertaModal/UploadRevisiPesertaModal";

import { eSertifikatServices } from "@/services/eSertifikat.service";
import { revisiServices } from "@/services/revisi.service";
import LISTS_STATUS_KOMPETENSI from "@/constants/statusKompetensi.constants";
import useChangeUrl from "@/hooks/useChangeUrl";
import DataTable from "@/components/ui/DataTable/DataTable";
import { TablePageSkeleton } from "@/components/ui/Skeletons";

const StatusKompetensi = ({ isGridUI = false }: { isGridUI?: boolean }) => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";

  const { dataStatusKompetensi, isLoading, refetchStatusKompetensi } =
    useStatusKompetensi();

  const uploadRevisiModal = useDisclosure();
  const [selectedPenilaianId, setSelectedPenilaianId] = useState("");
  const [downloadingIds, setDownloadingIds] = useState<Record<string, boolean>>(
    {},
  );
  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const allData = dataStatusKompetensi?.data || [];

  const handleDownload = async (penilaianId: string, type: string) => {
    if (!penilaianId) return;

    const key = `${type}-${penilaianId}`;

    try {
      setDownloadingIds((prev) => ({ ...prev, [key]: true }));

      let response;

      if (type === "sertifikat") {
        response = await eSertifikatServices.downloadSertifikat(penilaianId);
      } else if (type === "revisi-admin") {
        response = await revisiServices.downloadRevisiAdmin(penilaianId);
      } else {
        response = await revisiServices.downloadRevisiPeserta(penilaianId);
      }

      const contentType = response.headers["content-type"] || "application/pdf";

      // Buat blob dengan tipe file yang benar
      const blob = new Blob([response.data], {
        type: contentType,
      });

      const downloadUrl = window.URL.createObjectURL(blob);

      // Nama default file
      const contentDisposition = response.headers["content-disposition"];

      let fileName = type === "sertifikat" ? "sertifikat" : "revisi";

      // Ambil filename dari backend jika tersedia
      if (contentDisposition && contentDisposition.includes("filename")) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;

        const matches = filenameRegex.exec(contentDisposition);

        if (matches?.[1]) {
          fileName = matches[1].replace(/['"]/g, "");
        }
      } else {
        // Fallback extension berdasarkan content-type
        if (contentType.includes("pdf")) {
          fileName += ".pdf";
        } else if (
          contentType.includes("wordprocessingml") ||
          contentType.includes("msword")
        ) {
          fileName += ".docx";
        } else if (
          contentType.includes("presentationml") ||
          contentType.includes("ms-powerpoint")
        ) {
          fileName += ".pptx";
        } else if (
          contentType.includes("spreadsheetml") ||
          contentType.includes("ms-excel")
        ) {
          fileName += ".xlsx";
        } else if (contentType.includes("zip")) {
          fileName += ".zip";
        } else {
          fileName += ".pdf";
        }
      }

      const link = document.createElement("a");

      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch {
      alert("Gagal mengunduh file. Silakan coba lagi.");
    } finally {
      setTimeout(() => {
        setDownloadingIds((prev) => ({ ...prev, [key]: false }));
      }, 1000);
    }
  };

  const renderCell = useCallback(
    (item: Record<string, unknown>, columnKey: Key) => {
      const cellValue = item[columnKey as keyof typeof item];

      switch (columnKey) {
        case "statusKompetensi": {
          const status = (cellValue as string) || "";
          const colorMap: Record<string, "success" | "danger" | "warning"> = {
            kompeten: "success",
            belum_kompeten: "danger",
          };

          return (
            <Chip
              color={colorMap[status] || "warning"}
              size="sm"
              variant="flat"
            >
              {status.replace("_", " ")}
            </Chip>
          );
        }
        case "fileSertifikat": {
          if (!cellValue) return <span className="text-gray-400">-</span>;

          const pid = item.penilaianId as string;
          const key = `sertifikat-${pid}`;
          const isDownloading = downloadingIds[key];

          return (
            <button
              className="flex flex-row gap-1 text-blue-600 underline text-sm hover:text-blue-800 cursor-pointer"
              onClick={() => handleDownload(pid, "sertifikat")}
            >
              <Image
                alt="Doc Icon"
                height={20}
                src="/images/general/docIcon.png"
                width={20}
              />
              {isDownloading ? "Mengunduh..." : "Download"}
            </button>
          );
        }
        case "fileRevisiAdmin": {
          if (!cellValue) return <span className="text-gray-400">-</span>;

          const pid = item.penilaianId as string;
          const key = `revisi-admin-${pid}`;
          const isDownloading = downloadingIds[key];

          return (
            <button
              className="flex flex-row gap-1 text-blue-600 underline text-sm hover:text-blue-800 cursor-pointer"
              onClick={() => handleDownload(pid, "revisi-admin")}
            >
              <Image
                alt="Doc Icon"
                height={20}
                src="/images/general/docIcon.png"
                width={20}
              />
              {isDownloading ? "Mengunduh..." : "Download"}
            </button>
          );
        }
        case "fileRevisiPeserta": {
          if (!cellValue) return <span className="text-gray-400">-</span>;

          const pid = item.penilaianId as string;
          const key = `revisi-peserta-${pid}`;
          const isDownloading = downloadingIds[key];

          return (
            <button
              className="flex flex-row gap-1 text-blue-600 underline text-sm hover:text-blue-800 cursor-pointer"
              onClick={() => handleDownload(pid, "revisi-peserta")}
            >
              <Image
                alt="Doc Icon"
                height={20}
                src="/images/general/docIcon.png"
                width={20}
              />
              {isDownloading ? "Mengunduh..." : "Download"}
            </button>
          );
        }
        case "statusRevisi": {
          const statusRev = (cellValue as string) || "";
          const colorMapRev: Record<
            string,
            "success" | "danger" | "warning" | "default"
          > = {
            pending: "warning",
            disetujui: "success",
            ditolak: "danger",
          };

          if (!statusRev) return <span className="text-gray-400">-</span>;

          return (
            <Chip
              color={colorMapRev[statusRev] || "default"}
              size="sm"
              variant="flat"
            >
              {statusRev}
            </Chip>
          );
        }
        case "aksi": {
          const penilaianId = item.penilaianId as string;
          const kompeten = (item.statusKompetensi as string) === "kompeten";

          if (kompeten) return <span className="text-gray-400">-</span>;

          if (!penilaianId) return <span className="text-gray-400">-</span>;

          const hasExistingFile = !!item.fileRevisiPeserta;
          const label = hasExistingFile
            ? "Edit File Revisi"
            : "Upload File Revisi";

          return (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <CiMenuKebab className="text-default-700" />
                </Button>
              </DropdownTrigger>

              <DropdownMenu>
                <DropdownItem
                  key="upload-revisi-button"
                  className="text-brand"
                  onPress={() => {
                    setSelectedPenilaianId(penilaianId);
                    uploadRevisiModal.onOpen();
                  }}
                >
                  {label}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        }
        default:
          return cellValue as React.ReactNode;
      }
    },
    [uploadRevisiModal, downloadingIds],
  );

  return (
    <section className={isGridUI ? "w-full max-w-6xl mx-auto px-4 z-10" : ""}>
      <div className="mb-6">
        <div className="flex text-sm flex-row border-1 items-center border-brand justify-center rounded-2xl my-5 w-fit hover:bg-brand/10">
          <Link
            className="flex flex-row items-center gap-2 py-2 px-4 group"
            href={`/`}
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
          Status Kompetensi
        </h1>
        <p>Lihat status kompetensimu dan raih E-Sertifikatmu!</p>
      </div>
      {isLoadingSession ? (
        <TablePageSkeleton />
      ) : (
        <DataTable
          columns={LISTS_STATUS_KOMPETENSI}
          data={allData}
          emptyContent="Data kompetensi tidak ditemukan"
          isLoading={isLoading}
          placeholderTopContent="Cari..."
          renderCell={renderCell}
          totalPages={
            dataStatusKompetensi
              ? dataStatusKompetensi.pagination?.totalPages || 1
              : 1
          }
        />
      )}

      <UploadRevisiPesertaModal
        {...uploadRevisiModal}
        refetchStatusKompetensi={refetchStatusKompetensi}
        selectedPenilaianId={selectedPenilaianId}
      />
    </section>
  );
};

export default StatusKompetensi;
