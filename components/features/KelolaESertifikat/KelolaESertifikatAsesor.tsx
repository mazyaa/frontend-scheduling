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
import { useMutation } from "@tanstack/react-query";
import { IoMdDownload } from "react-icons/io";
import { useDisclosure } from "@heroui/modal";
import Image from "next/image";

import useKelolaESertifikatAsesor from "./useKelolaESertifikatAsesor";
import LISTS_KELOLA_E_SERTIFIKAT from "./eSertifikat.constants";
import RevisiAsesorModal from "./RevisiAsesorModal/RevisiAsesorModal";

import useChangeUrl from "@/hooks/useChangeUrl";
import DataTable from "@/components/ui/DataTable/DataTable";
import { TablePageSkeleton } from "@/components/ui/Skeletons";
import { revisiServices } from "@/services/revisi.service";
import { ToasterContext } from "@/context/ToasterContext";
import errorHandling from "@/utils/errrorHandling";

const KelolaESertifikatAsesor = () => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";
  const { setToaster } = useContext(ToasterContext);

  const [downloadingIds, setDownloadingIds] = useState<Record<string, boolean>>(
    {},
  );

  const {
    dataKelolaESertifikat,
    isLoadingKelolaESertifikat,
    isRefetchingKelolaESertifikat,
    refetchKelolaESertifikat,
    selectedId,
    setSelectedId,
  } = useKelolaESertifikatAsesor();

  const revisiAsesorModal = useDisclosure();

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const { mutate: mutateSetujui, isPending: isPendingSetujui } = useMutation({
    mutationFn: (penilaianId: string) =>
      revisiServices.setujuiRevisi(penilaianId),
    onSuccess: () => {
      setToaster({
        title: "Berhasil",
        type: "success",
        message: "Revisi sertifikat berhasil disetujui",
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

  const { mutate: mutateTolak, isPending: isPendingTolak } = useMutation({
    mutationFn: (penilaianId: string) =>
      revisiServices.tolakRevisi(penilaianId),
    onSuccess: () => {
      setToaster({
        title: "Berhasil",
        type: "success",
        message: "Revisi sertifikat berhasil ditolak",
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

  const handleDownloadRevisi = (fileRevisiUrl: string) => {
    window.open(fileRevisiUrl, "_blank", "noopener,noreferrer");
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
            <div className="flex gap-2 items-center justify-center">
              <Image
                alt="Doc Icon"
                height={20}
                src="/images/general/docIcon.png"
                width={20}
              />
              <span className="text-sm text-blue-600 underline">
                Sertifikat Terbit
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">-</span>
          );
        case "fileRevisi":
          return item.fileRevisi ? (
            <Button
              isIconOnly
              color="warning"
              size="sm"
              variant="light"
              onPress={() => handleDownloadRevisi(item.fileRevisi)}
            >
              <IoMdDownload size={18} />
            </Button>
          ) : (
            <span className="text-xs text-gray-400">-</span>
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
                {!item.fileRevisi && (
                  <DropdownItem
                    key="revision-button"
                    className="text-blue-600"
                    onPress={() => {
                      if (penilaianId) {
                        setSelectedId(penilaianId);
                        revisiAsesorModal.onOpen();
                      }
                    }}
                  >
                    Input File Revisi
                  </DropdownItem>
                )}
                {item.fileRevisi && (
                  <>
                    <DropdownItem
                      key="edit-revision-button"
                      className="text-green-600"
                      onPress={() => {
                        if (penilaianId) {
                          setSelectedId(penilaianId);
                          revisiAsesorModal.onOpen();
                        }
                      }}
                    >
                      Edit File Revisi
                    </DropdownItem>
                    <DropdownItem
                      key="setujui-button"
                      className="text-blue-700"
                      isDisabled={isPendingSetujui}
                      onPress={() => {
                        if (penilaianId) {
                          mutateSetujui(penilaianId);
                        }
                      }}
                    >
                      Setujui Revisi
                    </DropdownItem>
                    <DropdownItem
                      key="tolak-button"
                      className="text-red-700"
                      isDisabled={isPendingTolak}
                      onPress={() => {
                        if (penilaianId) {
                          mutateTolak(penilaianId);
                        }
                      }}
                    >
                      Tolak Revisi
                    </DropdownItem>
                  </>
                )}
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return null;
      }
    },
    [downloadingIds, mutateSetujui, mutateTolak, revisiAsesorModal, setSelectedId],
  );

  return (
    <section>
      {isLoadingSession ? (
        <TablePageSkeleton />
      ) : (
        <>
          <DataTable
            columns={LISTS_KELOLA_E_SERTIFIKAT}
            data={dataKelolaESertifikat?.data || []}
            emptyContent="E-Sertifikat tidak ditemukan"
            isLoading={
              isLoadingKelolaESertifikat ||
              isRefetchingKelolaESertifikat ||
              isPendingSetujui ||
              isPendingTolak
            }
            placeholderTopContent="Cari Berdasarkan Nama Peserta..."
            renderCell={renderCell}
            totalPages={
              dataKelolaESertifikat
                ? dataKelolaESertifikat.pagination.totalPages
                : 1
            }
          />

          <RevisiAsesorModal
            {...revisiAsesorModal}
            refetchKelolaESertifikat={refetchKelolaESertifikat}
            selectedId={selectedId}
          />
        </>
      )}
    </section>
  );
};

export default KelolaESertifikatAsesor;
