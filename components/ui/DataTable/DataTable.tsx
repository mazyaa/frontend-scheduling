import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Key, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { cn } from "@heroui/theme";
import { Spinner } from "@heroui/spinner";

import useChangeUrl from "@/hooks/useChangeUrl";
import { LIMIT_LISTS } from "@/constants/list.constats";

interface PropTypes {
  buttonTopContentLabel?: string;
  columns: Record<string, unknown>[];
  data: Record<string, unknown>[];
  emptyContent: string;
  isLoading?: boolean;
  onClickButtonTopContent?: () => void;
  renderCell: (
    item: Record<string, unknown>,
    columnKey: Key,
  ) => React.ReactNode;
  totalPages: number;
}

const DataTable = (props: PropTypes) => {
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
        {totalPages > 1 && (
          <Pagination
            isCompact
            loop // for looping pagination, so when user click next in last page, it will go to first page, and when user click prev in first page, it will go to last page
            showControls
            color="danger"
            page={Number(currentPage) || 1}
            total={totalPages}
            onChange={handleChangePage}
          />
        )}
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
    <Table
      bottomContent={BottomContent}
      bottomContentPlacement="outside"
      classNames={{
        base: "max-w-full",
        wrapper: cn({ "overflow-x-hidden": isLoading }),
      }}
      topContent={topContent}
      topContentPlacement="outside"
    >
      {/* Table Header */}
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid as Key}>
            {column.name as string}
          </TableColumn>
        )}
      </TableHeader>

      {/* Table Body */}
      <TableBody
        emptyContent={emptyContent}
        isLoading={isLoading}
        items={data}
        loadingContent={
          <div className="flex h-full w-full items-center justify-center bg-foreground-300/70 backdrop-blur-sm">
            <Spinner color="danger" />
          </div>
        }
      >
        {/* Table Row */}
        {(item) => (
          <TableRow key={item._id as Key}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DataTable;
