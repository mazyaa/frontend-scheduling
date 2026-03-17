import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import Image from "next/image";
import { Key, useMemo } from "react";
import { CiSearch } from "react-icons/ci";

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
        <div className="flex h-40 items-center justify-center">
          <Spinner />
        </div>
      ) : data.length === 0 ? (
        <Card className="p-8 text-center border border-gray-200 shadow-sm">
          <CardBody>
            <p className="text-gray-500 text-sm">{emptyContent}</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {data.map((item) => {
            const imageSrc =
              typeof item.image === "string" && item.image.trim() !== ""
                ? item.image
                : "/images/placeholder.png";

            return (
              <Card
                key={item.id as Key}
                className="group border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
              >
                {/* 🔥 IMAGE FULL COVER */}
                <CardHeader className="p-0 relative">
                  <div className="relative w-full h-44 overflow-hidden">
                    <Image
                      fill
                      alt="training image"
                      className="object-cover group-hover:scale-105 transition duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      src={imageSrc}
                    />
                  </div>

                  {/* subtle overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                </CardHeader>

                {/* 🧾 BODY */}
                <CardBody className="flex flex-col gap-3 p-4">
                  {columns
                    .filter((col) => col.uid !== "image" && col.uid !== "aksi")
                    .map((column) => (
                      <div key={column.uid as Key} className="flex flex-col">
                        <span className="text-[11px] text-gray-400 uppercase tracking-wide">
                          {column.name as string}
                        </span>
                        <span className="text-sm font-semibold text-gray-800 leading-snug">
                          {renderCell(item, column.uid as Key)}
                        </span>
                      </div>
                    ))}
                </CardBody>

                {/* ⚙️ FOOTER */}
                <CardFooter className="flex justify-between items-center px-4 pb-4 pt-0">
                  <span className="text-xs text-gray-400">
                    Detail informasi
                  </span>
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
