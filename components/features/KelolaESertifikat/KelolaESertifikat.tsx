"use client";

import { useSearchParams } from "next/navigation";
import { Key, useCallback, useContext, useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { CiMenuKebab } from "react-icons/ci";
import { useSession } from "next-auth/react";
import { Chip } from "@heroui/chip";
import { useDisclosure } from "@heroui/modal";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";

import useKelolaESertifikat from "./useKelolaESertifikat";
import LISTS_KELOLA_E_SERTIFIKAT from "./eSertifikat.constants";
import RevisiAdminModal from "./RevisiAdminModal/RevisiAdminModal";

import useChangeUrl from "@/hooks/useChangeUrl";
import DataTable from "@/components/ui/DataTable/DataTable";
import { TablePageSkeleton } from "@/components/ui/Skeletons";
import { eSertifikatServices } from "@/services/eSertifikat.service";
import { revisiServices } from "@/services/revisi.service";
import { ToasterContext } from "@/context/ToasterContext";
import errorHandling from "@/utils/errrorHandling";

const KelolaESertifikat = () => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";
  const { setToaster } = useContext(ToasterContext);

  const [downloadingIds, setDownloadingIds] = useState<Record<string, boolean>>(
    {},
  );
  const [selectedPenilaianId, setSelectedPenilaianId] = useState("");

  const uploadRevisiModal = useDisclosure();

  const {
    dataKelolaESertifikat,
    isLoadingKelolaESertifikat,
    isRefetchingKelolaESertifikat,
    refetchKelolaESertifikat,
    role,
  } = useKelolaESertifikat();

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const { mutate: mutatePublish, isPending: isPendingPublish } = useMutation({
    mutationFn: (penilaianId: string) =>
      eSertifikatServices.publishSertifikat(penilaianId),
    onSuccess: () => {
      setToaster({
        title: "Berhasil",
        type: "success",
        message: "Sertifikat berhasil diterbitkan",
      });
      refetchKelolaESertifikat();
    },
    onError: (error) => {
      const message = errorHandling(error);

      setToaster({
        title: "Gagal",
        type: "error",
        message: message || "Terjadi kesalahan",
      });
    },
  });

  const handleDownloadSertifikat = async (penilaianId: string) => {
    try {
      setDownloadingIds((prev) => ({ ...prev, [penilaianId]: true }));

      const response =
        await eSertifikatServices.downloadSertifikat(penilaianId);

      const contentType = response.headers["content-type"] || "application/zip";
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      const contentDisposition = response.headers["content-disposition"]; // Mendapatkan nama file dari header jika tersedia
      let fileName = "sertifikat.zip";

      if (contentDisposition && contentDisposition.includes("filename")) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);

        if (matches != null && matches[1]) {
          fileName = matches[1].replace(/['"]/g, "");
        }
      }

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      setToaster({
        title: "Gagal",
        type: "error",
        message: "Gagal mendownload sertifikat",
      });
    } finally {
      setTimeout(() => {
        setDownloadingIds((prev) => ({ ...prev, [penilaianId]: false }));
      }, 1000);
    }
  };

  const handleDownloadRevisiAdmin = async (penilaianId: string) => {
    try {
      setDownloadingIds((prev) => ({ ...prev, [penilaianId]: true }));

      const response = await revisiServices.downloadRevisiAdmin(penilaianId);

      const contentType = response.headers["content-type"] || "application/pdf";
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      const contentDisposition = response.headers["content-disposition"];
      let fileName = "revisi.pdf";

      if (contentDisposition && contentDisposition.includes("filename")) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);

        if (matches?.[1]) {
          fileName = matches[1].replace(/['"]/g, "");
        }
      }

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      setToaster({
        title: "Gagal",
        type: "error",
        message: "Gagal mendownload file revisi",
      });
    } finally {
      setTimeout(() => {
        setDownloadingIds((prev) => ({ ...prev, [penilaianId]: false }));
      }, 1000);
    }
  };

  const renderCell = useCallback(
    (itemSertifikat: Record<string, unknown>, columnKey: Key) => {
      const item = itemSertifikat as Record<string, any>;
      const penilaianId = item.id;

      switch (columnKey) {
        case "namaPeserta":
          return item.namaPeserta || "-";
        case "namaTraining":
          return item.namaTraining || "-";
        case "batch":
          return item.batch || "-";
        case "statusKompetensi":
          return (
            <Chip
              color={
                item.statusKompetensi === "kompeten" ? "success" : "warning"
              }
              size="sm"
              variant="flat"
            >
              {item.statusKompetensi === "kompeten"
                ? "Kompeten"
                : "Belum Kompeten"}
            </Chip>
          );
        case "fileSertifikat":
          return item.fileSertifikat ? (
            <Button
              className="w-auto"
              color="primary"
              variant="light"
              onPress={() => handleDownloadSertifikat(item.penilaianId)}
            >
              {downloadingIds[penilaianId] ? (
                <span className="text-xs">...</span>
              ) : (
                <div className="flex gap-2 items-center">
                  <Image
                    alt="Doc Icon"
                    height={20}
                    src="/images/general/docIcon.png"
                    width={20}
                  />

                  <span className="text-sm text-blue-600 underline">
                    {downloadingIds[item.penilaianId]
                      ? "Mengunduh..."
                      : "Download Sertifikat"}
                  </span>
                </div>
              )}
            </Button>
          ) : (
            <span className="text-xs text-gray-400">-</span>
          );
        case "fileRevisi":
          return item.fileRevisi ? (
            <Button
              className="w-auto"
              color="primary"
              variant="light"
              onPress={() => handleDownloadRevisiAdmin(item.penilaianId)}
            >
              {downloadingIds[item.penilaianId] ? (
                <span className="text-xs">...</span>
              ) : (
                <div className="flex gap-2 items-center">
                  <Image
                    alt="Doc Icon"
                    height={20}
                    src="/images/general/docIcon.png"
                    width={20}
                  />
                  <span className="text-sm text-blue-600 underline">
                    Download
                  </span>
                </div>
              )}
            </Button>
          ) : (
            <span className="text-xs text-gray-400">-</span>
          );
        case "statusRevisi": {
          const statusRev = item.statusRevisi as string;
          const colorMapRev: Record<
            string,
            "success" | "danger" | "warning" | "default"
          > = {
            pending: "warning",
            disetujui: "success",
            ditolak: "danger",
          };

          if (!statusRev)
            return <span className="text-xs text-gray-400">-</span>;

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
        case "aksi":
          return role === "admin" && !item.fileSertifikat ? (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <CiMenuKebab className="text-default-700" />
                </Button>
              </DropdownTrigger>

              <DropdownMenu>
                <DropdownItem
                  key="publish-button"
                  className="text-brand"
                  isDisabled={
                    item.statusKompetensi === "belum_kompeten" ||
                    isPendingPublish
                  }
                  onPress={() => {
                    if (item.penilaianId) {
                      mutatePublish(item.penilaianId);
                    }
                  }}
                >
                  Terbitkan E-Sertifikat
                </DropdownItem>
                <DropdownItem
                  key="upload-revisi-button"
                  className="text-brand"
                  onPress={() => {
                    if (item.penilaianId) {
                      setSelectedPenilaianId(item.penilaianId);
                      uploadRevisiModal.onOpen();
                    }
                  }}
                >
                  {item.fileRevisi ? "Edit File Revisi" : "Upload File Revisi"}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : null;
        default:
          return null;
      }
    },
    [downloadingIds, role, mutatePublish, uploadRevisiModal],
  );

  return (
    <section>
      {isLoadingSession ? (
        <TablePageSkeleton />
      ) : (
        <DataTable
          columns={LISTS_KELOLA_E_SERTIFIKAT}
          data={dataKelolaESertifikat?.data || []}
          emptyContent="E-Sertifikat tidak ditemukan"
          isLoading={
            isLoadingKelolaESertifikat ||
            isRefetchingKelolaESertifikat ||
            isPendingPublish
          }
          placeholderTopContent="Cari Berdasarkan Nama Peserta..."
          renderCell={renderCell}
          totalPages={
            dataKelolaESertifikat
              ? dataKelolaESertifikat.pagination.totalPages
              : 1
          }
        />
      )}

      <RevisiAdminModal
        {...uploadRevisiModal}
        refetchKelolaESertifikat={refetchKelolaESertifikat}
        selectedPenilaianId={selectedPenilaianId}
      />
    </section>
  );
};

export default KelolaESertifikat;
