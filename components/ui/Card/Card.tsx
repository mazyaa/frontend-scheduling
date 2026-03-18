import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { TbFolderOpen } from "react-icons/tb";
import Image from "next/image";
import { Key, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { motion } from "framer-motion";
import { cn } from "@heroui/theme";
import { Spinner } from "@heroui/spinner";

import { LIMIT_LISTS } from "@/constants/list.constats";
import useChangeUrl from "@/hooks/useChangeUrl";
interface Proptypes {
  buttonTopContentLabel?: string;
  columns: Record<string, unknown>[];
  data: Record<string, React.ReactNode>[];
  emptyContent: string;
  isLoading?: boolean;
  onClickButtonTopContent?: () => void;
  renderCell: (
    item: Record<string, unknown>,
    columnKey: Key,
  ) => React.ReactNode;
  totalPages: number;
}
const CardTable = (props: Proptypes) => {
  const {
    buttonTopContentLabel,
    columns,
    data,
    emptyContent,
    isLoading,
    onClickButtonTopContent,
    renderCell,
    totalPages,
  } = props;

  const {
    currentLimit,
    currentPage,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
    handleClearSearch,
  } = useChangeUrl();

  const topContent = useMemo(() => {
    return (
      <div className="justify-between flex flex-col-reverse items-start gap-y-4 lg:flex-row lg:items-center lg:justify-between">
        {/* top content input & button*/}
        <Input
          isClearable // Enable the clear button
          className="w-full sm:max-w-[24%]"
          placeholder="Cari Training..."
          startContent={<CiSearch />}
          onChange={handleChangeSearch}
          onClear={handleClearSearch}
        />

        {buttonTopContentLabel && (
          <Button
            className="bg-brand text-white"
            onPress={onClickButtonTopContent}
          >
            {buttonTopContentLabel}
          </Button>
        )}
      </div>
    );
  }, [
    buttonTopContentLabel,
    handleChangeSearch,
    handleClearSearch,
    onClickButtonTopContent,
  ]);

  // for memoize bottom content
  const BottomContent = useMemo(() => {
    return (
      <div className="items-center flex justify-center px-2 py-2 lg:justify-between">
        <Select
          disallowEmptySelection // must be selected
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

        {/* Pagination content view */}
        <Pagination
          isCompact
          loop // for looping pagination, so when user click next in last page, it will go to first page, and when user click prev in first page, it will go to last page
          showControls
          color="default"
          page={Number(currentPage) || 1}
          total={totalPages}
          onChange={handleChangePage}
        />
      </div>
    );
  }, [
    currentLimit,
    currentPage,
    handleChangeLimit,
    handleChangePage,
    totalPages,
  ]);

  return (
    <div className="flex flex-col gap-6">
      {topContent}

      {isLoading ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 py-16"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <div className="relative flex items-center justify-center">
            <Spinner />
          </div>

          {/* Text */}
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
      ) : data.length === 0 ? (
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
              {/* Icon container */}
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

              {/* Text */}
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
                  {emptyContent}
                </span>
              </motion.div>

              {/* Decorative dots */}
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {data.map((item) => {
            const imageSrc =
              typeof item.image === "string" && item.image.trim() !== ""
                ? item.image
                : "/images/default.png";

            return (
              <Card
                key={item.id as Key}
                className="group border border-gray-200 shadow-sm rounded-2xl overflow-hidden"
              >
                {/* Image */}
                <CardHeader className="p-0 relative">
                  <div className="relative w-full h-100 overflow-hidden">
                    <Image
                      fill
                      alt="training image"
                      className="object-fit-cover p-2 rounded-2xl hover:scale-105 transition duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      src={imageSrc}
                    />
                  </div>
                </CardHeader>

                {/* information */}
                <CardBody className="px-4 py-4 overflow-hidden">
                  <div className="grid grid-rows-2 gap-2">
                    {columns
                      .filter(
                        (col) => col.uid !== "image" && col.uid !== "aksi",
                      )
                      .map((column, index) => (
                        <motion.div
                          key={column.uid as Key}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            "flex flex-col items-center text-center gap-1 p-3 rounded-xl",
                            "bg-default-50 hover:bg-default-100",
                            "border border-default-100 hover:border-brand/20",
                            "transition-all duration-200 group cursor-default",
                          )}
                          initial={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          {/* Label */}
                          <span
                            className={cn(
                              "text-[13px] font-bold uppercase tracking-[0.12em]",
                              "text-default-400 group-hover:text-brand",
                              "transition-colors duration-200",
                            )}
                          >
                            {column.name as string}
                          </span>

                          {/* Value */}
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

                <CardFooter className="my-2">
                  {renderCell(item, "aksi")}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {BottomContent}
    </div>
  );
};

export default CardTable;
