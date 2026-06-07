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
import { CiMenuKebab } from "react-icons/ci";
import { useDisclosure } from "@heroui/modal";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";

import useKelolaMateri from "./useKelolaMateri";
import LISTS_KELOLA_MATERI, { LISTS_PESERTA_MATERI } from "./materi.constants";
import TambahMateriModal from "./TambahMateriModal/TambahMateriModal";
import EditMateriModal from "./EditMateriModal/EditMateriModal";
import DeleteMateriModal from "./DeleteMateriModal/DeleteMateriModal";

import useChangeUrl from "@/hooks/useChangeUrl";
import DataTable from "@/components/ui/DataTable/DataTable";
import { TablePageSkeleton } from "@/components/ui/Skeletons";
import { materiServices } from "@/services/materi.service";

const KelolaMateri = ({ isGridUI = false }: { isGridUI?: boolean }) => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";

  // Loading state mapping untuk handle spesifik item
  const [downloadingIds, setDownloadingIds] = useState<Record<string, boolean>>(
    {},
  );

  const {
    dataKelolaMateri,
    isLoadingKelolaMateri,
    isRefetchingKelolaMateri,
    refetchKelolaMateri,
    selectedId,
    setSelectedId,
    role,
  } = useKelolaMateri();

  const tambahMateriModal = useDisclosure();
  const editMateriModal = useDisclosure();
  const deleteMateriModal = useDisclosure();

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const handleDownload = async (fileUrl: string, id: string) => {
    try {
      setDownloadingIds((prev) => ({ ...prev, [id]: true }));

      const response = await materiServices.downloadMateri(id);

      // Dapatkan tipe konten untuk memastikan OS/Browser mengenali format file
      const contentType = response.headers["content-type"] || "application/pdf";

      // Ambil blob dari response data dengan tipe yang jelas
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      // Ambil nama file dari header content-disposition jika ada, atau gunakan default
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "materi-training";

      if (contentDisposition && contentDisposition.includes("filename")) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);

        if (matches != null && matches[1]) {
          fileName = matches[1].replace(/['"]/g, "");
        }
      } else {
        // Fallback ekstensi jika backend tidak mengirim disposition
        if (contentType.includes("pdf")) fileName += ".pdf";
        else if (
          contentType.includes("wordprocessingml") ||
          contentType.includes("msword")
        )
          fileName += ".docx";
        else if (
          contentType.includes("presentationml") ||
          contentType.includes("ms-powerpoint")
        )
          fileName += ".pptx";
        else fileName += ".pdf"; // Default fallback assumption for abstract %PDF text
      }

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Gagal mengunduh materi. Silakan coba lagi.");
    } finally {
      setTimeout(() => {
        setDownloadingIds((prev) => ({ ...prev, [id]: false }));
      }, 1000);
    }
  };

  const renderCell = useCallback(
    (itemMateri: Record<string, unknown>, columnKey: Key) => {
      const cellValue = itemMateri[columnKey as keyof typeof itemMateri];

      // Extract ID dari fileMateri URL jika tidak ada field id
      let itemId = (itemMateri as any)?.id;

      if (!itemId && itemMateri.fileMateri) {
        // Extract ID dari URL: http://localhost:8080/api/materi/{id}/download
        const match = (itemMateri.fileMateri as string).match(
          /\/materi\/([^/]+)\/download/,
        );

        itemId = match ? match[1] : undefined;
      }

      switch (columnKey) {
        case "fileMateri":
          if (!cellValue) return <span>-</span>;

          return (
            <button
              className="flex items-center gap-2 cursor-pointer hover:text-brand transition-colors"
              onClick={() => {
                handleDownload(cellValue as string, itemId);
              }}
            >
              <Image
                alt="Doc Icon"
                height={20}
                src="/images/general/docIcon.png"
                width={20}
              />
              <span className="text-sm text-blue-600 underline">
                {downloadingIds[itemId] ? "Mengunduh..." : "Download materi"}
              </span>
            </button>
          );
        case "aksi":
          // Return null untuk peserta karena tidak ada kolom aksi
          if (role === "peserta") return null;

          return (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <CiMenuKebab className="text-default-700" />
                </Button>
              </DropdownTrigger>

              <DropdownMenu>
                <DropdownItem
                  key="edit-materi-button"
                  className="text-green-700"
                  onPress={() => {
                    if (itemId) {
                      setSelectedId(itemId);
                      editMateriModal.onOpen();
                    }
                  }}
                >
                  Edit Materi
                </DropdownItem>
                <DropdownItem
                  key="delete-materi-button"
                  className="text-red-700"
                  onPress={() => {
                    if (itemId) {
                      setSelectedId(itemId);
                      deleteMateriModal.onOpen();
                    }
                  }}
                >
                  Delete Materi
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue as React.ReactNode;
      }
    },
    [
      downloadingIds,
      role,
      editMateriModal,
      deleteMateriModal,
      setSelectedId,
      handleDownload,
    ],
  );

  const columns =
    role === "peserta" ? LISTS_PESERTA_MATERI : LISTS_KELOLA_MATERI;

  return (
    <section className={isGridUI ? "w-full max-w-6xl mx-auto px-4 z-10" : ""}>
      {isGridUI && (
        <div className="mb-6 z-[999]">
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
            Materi Training
          </h1>
          <p>
            Mengelola informasi dan dokumen{" "}
            <span className="text-brand">materi pelatihan</span> guna mendukung
            proses pembelajaran yang terorganisir.
          </p>
        </div>
      )}
      {isLoadingSession ? (
        <TablePageSkeleton />
      ) : (
        <DataTable
          buttonTopContentLabel={
            role !== "peserta" ? "Tambah Materi" : undefined
          }
          columns={columns}
          data={dataKelolaMateri?.data || []}
          emptyContent="Materi tidak ditemukan"
          isLoading={isLoadingKelolaMateri || isRefetchingKelolaMateri}
          placeholderTopContent="Cari Berdasarkan Nama Materi..."
          renderCell={renderCell}
          totalPages={
            dataKelolaMateri ? dataKelolaMateri.pagination.totalPages : 1
          }
          onClickButtonTopContent={
            role !== "peserta" ? () => tambahMateriModal.onOpen() : undefined
          }
        />
      )}

      {role !== "peserta" && (
        <>
          <TambahMateriModal
            {...tambahMateriModal}
            refetchKelolaMateri={refetchKelolaMateri}
          />
          <EditMateriModal
            {...editMateriModal}
            currentData={dataKelolaMateri?.data || []}
            refetchKelolaMateri={refetchKelolaMateri}
            selectedId={selectedId}
          />
          <DeleteMateriModal
            {...deleteMateriModal}
            refetchKelolaMateri={refetchKelolaMateri}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </>
      )}
    </section>
  );
};

export default KelolaMateri;
