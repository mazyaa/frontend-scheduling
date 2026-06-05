"use client";

import { useSearchParams } from "next/navigation";
import { Key, ReactNode, useCallback, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { useSession } from "next-auth/react";
import { useDisclosure } from "@heroui/modal";
import { cn } from "@heroui/theme";
import { motion } from "framer-motion";
import { CiSearch } from "react-icons/ci";
import { FiEdit2, FiEye, FiTrash2, FiUploadCloud } from "react-icons/fi";
import { IoIosSend } from "react-icons/io";
import { TbFolderOpen } from "react-icons/tb";
import Image from "next/image";

import { LIST_KELOLA_PESERTA } from "./kelolaPeserta.constants";
import useKelolaPeserta from "./useKelolaPeserta";
import useKirimKredensial from "./useKirimKredensial";
import ImportPesertaModal from "./ImportPesertaModal";
import TambahPesertaModal from "./TambahPesertaModal";
import EditPesertaModal from "./EditPesertaModal";
import DeletePesertaModal from "./DeletePesertaModal";
import DetailPesertaModal from "./DetailPesertaModal";

import { LIMIT_LISTS } from "@/constants/list.constats";
import useChangeUrl from "@/hooks/useChangeUrl";
import { CardMapSkeleton } from "@/components/ui/Skeletons";

const ALL_KEY = "__all__";

const KelolaPeserta = () => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";

  const {
    dataKelolaPeserta,
    isLoadingKelolaPeserta,
    isRefetchingKelolaPeserta,
    refetchKelolaPeserta,
    setSelectedId,
    selectedData,
    setSelectedData,
    selectedJadwalTrainingId,
    setSelectedJadwalTrainingId,
    dataFilterJadwal,
    isLoadingFilterJadwal,
    filteredParticipants,
  } = useKelolaPeserta();

  const { handleKirimKredensial } = useKirimKredensial();

  const {
    currentLimit,
    currentPage,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
    handleClearSearch,
    setUrl,
  } = useChangeUrl();

  const importPesertaModal = useDisclosure();
  const tambahPesertaModal = useDisclosure();
  const editPesertaModal = useDisclosure();
  const deletePesertaModal = useDisclosure();
  const detailPesertaModal = useDisclosure();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const renderCell = useCallback(
    (itemPeserta: Record<string, unknown>, columnKey: Key) => {
      const cellValue = itemPeserta[columnKey as keyof typeof itemPeserta];

      switch (columnKey) {
        case "training":
          const pesertaTraining = (itemPeserta as any)?.pesertaTraining;

          if (!pesertaTraining || pesertaTraining.length === 0) return "-";

          return (
            <div className="flex flex-col gap-1">
              {pesertaTraining.map((pt: any) => (
                <span
                  key={pt.id}
                  className="text-xs bg-default-100 px-2 py-0.5 rounded"
                >
                  {pt.jadwalTraining?.training?.namaTraining || "Training"} -{" "}
                  {pt.jadwalTraining?.batch || "-"}
                </span>
              ))}
            </div>
          );
        case "aksi":
          return (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 w-full max-w-[300px] mx-auto">
              <Button
                className={cn(
                  "h-8 px-3 rounded-lg font-medium text-xs",
                  "flex items-center gap-1.5",
                  "bg-blue-50 hover:bg-blue-100",
                  "text-blue-600 hover:text-blue-700",
                  "border border-blue-100 hover:border-blue-200",
                  "transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  "shadow-sm hover:shadow-md",
                )}
                size="sm"
                variant="flat"
                onPress={() => {
                  setSelectedData(itemPeserta as any);
                  detailPesertaModal.onOpen();
                }}
              >
                <FiEye size={13} />
                Detail
              </Button>

              <Button
                className={cn(
                  "h-8 px-3 rounded-lg font-medium text-xs",
                  "flex items-center gap-1.5",
                  "bg-orange-50 hover:bg-orange-100",
                  "text-orange-600 hover:text-orange-700",
                  "border border-orange-100 hover:border-orange-200",
                  "transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  "shadow-sm hover:shadow-md",
                )}
                size="sm"
                variant="flat"
                onPress={() => {
                  if (itemPeserta.id) {
                    handleKirimKredensial(itemPeserta.id as string);
                  }
                }}
              >
                <IoIosSend size={13} />
                Kirim Kredensial
              </Button>

              <Button
                className={cn(
                  "h-8 px-3 rounded-lg font-medium text-xs",
                  "flex items-center gap-1.5",
                  "bg-blue-50 hover:bg-blue-100",
                  "text-blue-600 hover:text-blue-700",
                  "border border-blue-100 hover:border-blue-200",
                  "transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  "shadow-sm hover:shadow-md",
                )}
                size="sm"
                variant="flat"
                onPress={() => {
                  setSelectedData(itemPeserta as any);
                  editPesertaModal.onOpen();
                }}
              >
                <FiEdit2 size={13} />
                Edit
              </Button>

              <Button
                className={cn(
                  "h-8 px-3 rounded-lg font-medium text-xs",
                  "flex items-center gap-1.5",
                  "bg-red-50 hover:bg-red-100",
                  "text-red-500 hover:text-red-600",
                  "border border-red-100 hover:border-red-200",
                  "transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  "shadow-sm hover:shadow-md",
                )}
                size="sm"
                variant="flat"
                onPress={() => {
                  setSelectedData(itemPeserta as any);
                  deletePesertaModal.onOpen();
                }}
              >
                <FiTrash2 size={13} />
                Delete
              </Button>
            </div>
          );
        default:
          return cellValue as ReactNode;
      }
    },
    [
      setSelectedId,
      setSelectedData,
      detailPesertaModal,
      editPesertaModal,
      deletePesertaModal,
      handleKirimKredensial,
    ],
  );

  const topContent = useMemo(() => {
    return (
      <div className="justify-between flex flex-col-reverse items-start gap-y-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            isClearable
            className="w-full sm:max-w-[240px]"
            placeholder="Cari Peserta..."
            startContent={<CiSearch />}
            onChange={handleChangeSearch}
            onClear={handleClearSearch}
          />
          <Select
            disallowEmptySelection
            className="w-full sm:max-w-[200px]"
            label="Filter Jadwal"
            selectedKeys={[selectedJadwalTrainingId || ALL_KEY]}
            size="sm"
            variant="bordered"
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as string;

              setSelectedJadwalTrainingId(key === ALL_KEY ? "" : key);
            }}
          >
            <SelectItem key={ALL_KEY} textValue="Semua Jadwal">
              Semua Jadwal
            </SelectItem>
            {isLoadingFilterJadwal ? (
              <SelectItem key="loading" textValue="Loading...">
                Loading...
              </SelectItem>
            ) : (
              (dataFilterJadwal || []).map((jadwal: any) => (
                <SelectItem
                  key={jadwal.id}
                  textValue={`${jadwal.training?.namaTraining || "Tanpa Nama"} - ${jadwal.batch}`}
                >
                  {jadwal.training?.namaTraining || "Tanpa Nama"} -{" "}
                  {jadwal.batch}
                </SelectItem>
              ))
            )}
          </Select>
        </div>

        <div className="flex flex-row items-center gap-2">
          <Button
            className="bg-green-600 text-white"
            startContent={<FiUploadCloud />}
            onPress={() => importPesertaModal.onOpen()}
          >
            Import Peserta
          </Button>
          <Button
            className="bg-brand text-white"
            onPress={() => tambahPesertaModal.onOpen()}
          >
            Tambah Peserta
          </Button>
        </div>
      </div>
    );
  }, [
    handleChangeSearch,
    handleClearSearch,
    selectedJadwalTrainingId,
    setSelectedJadwalTrainingId,
    dataFilterJadwal,
    isLoadingFilterJadwal,
    importPesertaModal,
    tambahPesertaModal,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="items-center flex justify-center px-2 py-2 lg:justify-between">
        <Select
          disallowEmptySelection
          className="hidden max-w-36 lg:block"
          selectedKeys={[`${currentLimit}`]}
          selectionMode="single"
          size="md"
          startContent={<p className="text-small">Tampilkan: </p>}
          onChange={handleChangeLimit}
        >
          {LIMIT_LISTS.map((item) => (
            <SelectItem key={item.value} className="border-b-2">
              {item.label}
            </SelectItem>
          ))}
        </Select>

        <Pagination
          isCompact
          loop
          showControls
          color="default"
          page={Number(currentPage) || 1}
          total={
            dataKelolaPeserta ? dataKelolaPeserta.pagination.totalPages : 1
          }
          onChange={handleChangePage}
        />
      </div>
    );
  }, [
    currentLimit,
    currentPage,
    dataKelolaPeserta,
    handleChangeLimit,
    handleChangePage,
  ]);

  const isLoading = isLoadingKelolaPeserta || isRefetchingKelolaPeserta;

  const renderCard = (item: Record<string, unknown>) => {
    let rawImageSrc = typeof item.image === "string" ? item.image.trim() : "";

    if (rawImageSrc.includes("drive.google.com")) {
      const matchId =
        rawImageSrc.match(/id=([^&]+)/) || rawImageSrc.match(/\/d\/([^/]+)/);

      if (matchId && matchId[1]) {
        rawImageSrc = `https://lh3.googleusercontent.com/d/${matchId[1]}=w1000`;
      }
    }

    const imageSrc =
      rawImageSrc &&
      (/^(https?:\/\/)/.test(rawImageSrc) ||
        rawImageSrc.startsWith("/") ||
        rawImageSrc.startsWith("data:image/") ||
        rawImageSrc.startsWith("blob:"))
        ? rawImageSrc
        : "/Images/general/user.png";

    return (
      <Card
        key={item.id as Key}
        className="group border border-gray-200 shadow-sm rounded-2xl overflow-hidden"
      >
        <CardHeader className="p-0 relative">
          <div className="relative w-full h-100 overflow-hidden bg-slate-100 flex items-center justify-center">
            <Image
              fill
              alt="image"
              className="p-2 object-cover object-top rounded-2xl hover:scale-105 transition duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              src={imageSrc}
              unoptimized={imageSrc.includes("google")}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/Images/general/user.png";
              }}
            />
          </div>
        </CardHeader>

        <CardBody className="px-4 py-4 overflow-hidden">
          <div className="grid grid-rows-2 gap-2">
            {LIST_KELOLA_PESERTA.filter(
              (col) =>
                (col.isSummary === undefined || col.isSummary === true) &&
                col.uid !== "image" &&
                col.uid !== "aksi",
            ).map((column, index) => (
              <motion.div
                key={column.uid}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "flex flex-col items-center text-center gap-1 p-3 rounded-xl",
                  "bg-default-50 hover:bg-default-100",
                  "border border-default-100 hover:border-brand/20",
                  "transition-all duration-200 group cursor-default",
                )}
                initial={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.05,
                }}
              >
                <span
                  className={cn(
                    "text-[13px] font-bold uppercase tracking-[0.12em]",
                    "text-default-400 group-hover:text-brand",
                    "transition-colors duration-200",
                  )}
                >
                  {column.label as string}
                </span>

                <span
                  className={cn(
                    "text-[13px] font-semibold text-default-800 leading-snug",
                    "group-hover:text-default-900 transition-colors duration-200",
                  )}
                >
                  {renderCell(item, column.uid as Key)}
                </span>
              </motion.div>
            ))}
          </div>
        </CardBody>

        <CardFooter className="my-2">{renderCell(item, "aksi")}</CardFooter>
      </Card>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 py-16"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <div className="relative flex items-center justify-center">
            <Spinner />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold text-default-600 tracking-wide">
              Memuat data
            </span>
            <span className="flex items-center gap-1 text-xs text-default-400">
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              >
                •
              </motion.span>
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
              >
                •
              </motion.span>
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
              >
                •
              </motion.span>
            </span>
          </div>
        </motion.div>
      );
    }

    if (filteredParticipants.length === 0) {
      return (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center py-8"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card
            className={cn(
              "w-full max-w-sm border border-default-100",
              "shadow-md bg-gradient-to-b from-default-50 to-white",
            )}
          >
            <CardBody className="flex flex-col items-center gap-4 px-8 py-10">
              <motion.div
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl",
                  "bg-default-100 border border-default-200 shadow-sm",
                )}
                initial={{ scale: 0.8, opacity: 0 }}
                transition={{ delay: 0.15, duration: 0.35, ease: "backOut" }}
              >
                <TbFolderOpen className="text-default-400 text-3xl" />
              </motion.div>

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-1.5 text-center"
                initial={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <span className="text-sm font-bold text-default-700 tracking-wide">
                  Tidak Ada Data
                </span>
                <span className="text-xs text-default-400 leading-relaxed">
                  Peserta tidak ditemukan
                </span>
              </motion.div>

              <motion.div
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5 pt-1"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.span
                    key={i}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
                    className="h-1.5 w-1.5 rounded-full bg-brand/40"
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </motion.div>
            </CardBody>
          </Card>
        </motion.div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredParticipants.map((peserta: any) => renderCard(peserta))}
      </div>
    );
  };

  return (
    <section>
      {isLoadingSession ? (
        <CardMapSkeleton />
      ) : (
        <div className="flex flex-col gap-6">
          {topContent}
          {renderContent()}
          {bottomContent}
        </div>
      )}

      <ImportPesertaModal
        {...importPesertaModal}
        refetchPeserta={refetchKelolaPeserta}
      />
      <TambahPesertaModal
        {...tambahPesertaModal}
        refetchPeserta={refetchKelolaPeserta}
      />
      <EditPesertaModal
        {...editPesertaModal}
        refetchPeserta={refetchKelolaPeserta}
        selectedData={selectedData}
      />
      <DeletePesertaModal
        {...deletePesertaModal}
        refetchPeserta={refetchKelolaPeserta}
        selectedData={selectedData}
      />
      <DetailPesertaModal {...detailPesertaModal} selectedData={selectedData} />
    </section>
  );
};

export default KelolaPeserta;
