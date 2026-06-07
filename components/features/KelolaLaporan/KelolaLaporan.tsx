"use client";

import { useSearchParams } from "next/navigation";
import { Key, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Tabs, Tab } from "@heroui/tabs";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";

import useKelolaLaporan from "./useKelolaLaporan";
import {
  LISTS_LAPORAN_SERTIFIKAT,
  LISTS_LAPORAN_PESERTA,
} from "./laporan.constants";

import useChangeUrl from "@/hooks/useChangeUrl";
import DataTable from "@/components/ui/DataTable/DataTable";
import { TablePageSkeleton } from "@/components/ui/Skeletons";

const KelolaLaporan = () => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoadingSession = status === "loading";

  const [selectedTab, setSelectedTab] = useState<"sertifikat" | "peserta">(
    "sertifikat",
  );

  const {
    dataKelolaLaporan,
    isLoadingKelolaLaporan,
    isRefetchingKelolaLaporan,
    selectedBatch,
    setSelectedBatch,
    dataFilterJadwal,
    isLoadingFilterJadwal,
  } = useKelolaLaporan(selectedTab);

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, [searchParams]);

  const handleCetakPDF = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const data = dataKelolaLaporan?.data || [];
    const isSertifikat = selectedTab === "sertifikat";
    const now = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const tableHeader = isSertifikat
      ? `<tr>
           <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#1a1f36;color:#fff;text-align:left;font-weight:600">No</th>
           <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#1a1f36;color:#fff;text-align:left;font-weight:600">Nama Training</th>
           <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#1a1f36;color:#fff;text-align:left;font-weight:600">Batch</th>
           <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#1a1f36;color:#fff;text-align:center;font-weight:600">Total Sertifikat</th>
         </tr>`
      : `<tr>
           <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#1a1f36;color:#fff;text-align:left;font-weight:600">No</th>
           <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#1a1f36;color:#fff;text-align:left;font-weight:600">Nama Peserta</th>
           <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#1a1f36;color:#fff;text-align:left;font-weight:600">Nama Training</th>
           <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#1a1f36;color:#fff;text-align:left;font-weight:600">Batch</th>
           <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#1a1f36;color:#fff;text-align:left;font-weight:600">Status Kompetensi</th>
         </tr>`;

    const tableRows = data
      .map((item: any, index: number) => {
        const rowBg = index % 2 === 0 ? "#f9fafb" : "#fff";
        if (isSertifikat) {
          return `<tr style="background:${rowBg}">
            <td style="border:1px solid #e5e7eb;padding:10px 16px;text-align:center">${index + 1}</td>
            <td style="border:1px solid #e5e7eb;padding:10px 16px">${item.namaTraining || "-"}</td>
            <td style="border:1px solid #e5e7eb;padding:10px 16px">${item.batch || "-"}</td>
            <td style="border:1px solid #e5e7eb;padding:10px 16px;text-align:center;font-weight:600">${item.totalSertifikat ?? 0}</td>
          </tr>`;
        }
        const statusColor = item.statusKompetensi === "kompeten" ? "#16a34a" : "#d97706";
        const statusBg = item.statusKompetensi === "kompeten" ? "#dcfce7" : "#fef3c7";
        return `<tr style="background:${rowBg}">
          <td style="border:1px solid #e5e7eb;padding:10px 16px;text-align:center">${index + 1}</td>
          <td style="border:1px solid #e5e7eb;padding:10px 16px">${item.namaPeserta || "-"}</td>
          <td style="border:1px solid #e5e7eb;padding:10px 16px">${item.namaTraining || "-"}</td>
          <td style="border:1px solid #e5e7eb;padding:10px 16px">${item.batch || "-"}</td>
          <td style="border:1px solid #e5e7eb;padding:10px 16px"><span style="display:inline-block;padding:2px 10px;border-radius:9999px;font-size:12px;background:${statusBg};color:${statusColor};font-weight:600">${item.statusKompetensi === "kompeten" ? "Kompeten" : "Belum Kompeten"}</span></td>
        </tr>`;
      })
      .join("");

    const title = isSertifikat ? "Laporan Sertifikat" : "Laporan Peserta";

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { margin: 0; size: A4; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1f2937; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div style="text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:3px solid #1a1f36">
            <img src="${window.location.origin}/Images/general/veritrust-logo.png" alt="Logo" style="height:50px;margin-bottom:10px" />
            <h1 style="font-size:22px;font-weight:700;color:#1a1f36;margin-bottom:4px">${title}</h1>
            <p style="font-size:13px;color:#6b7280">Dicetak pada ${now}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead>${tableHeader}</thead>
            <tbody>${tableRows}</tbody>
          </table>
          <script>
            window.onload = function() {
              var style = document.createElement('style');
              style.innerHTML = '@page { margin: 0 !important; } @media print { html, body { margin: 0 !important; padding: 0 !important; } }';
              document.head.appendChild(style);
              setTimeout(function() { window.print(); window.close(); }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }, [dataKelolaLaporan, selectedTab]);

  const renderCellSertifikat = useCallback(
    (item: Record<string, unknown>, columnKey: Key): ReactNode => {
      const cellValue = item[columnKey as keyof typeof item];

      switch (columnKey) {
        case "namaTraining":
          return (cellValue as ReactNode) || "-";
        case "batch":
          return (cellValue as ReactNode) || "-";
        case "totalSertifikat":
          return cellValue !== undefined && cellValue !== null
            ? Number(cellValue)
            : 0;
        default:
          return cellValue as ReactNode;
      }
    },
    [],
  );

  const renderCellPeserta = useCallback(
    (item: Record<string, unknown>, columnKey: Key): ReactNode => {
      const cellValue = item[columnKey as keyof typeof item];

      switch (columnKey) {
        case "namaPeserta":
          return (cellValue as ReactNode) || "-";
        case "namaTraining":
          return (cellValue as ReactNode) || "-";
        case "batch":
          return (cellValue as ReactNode) || "-";
        case "statusKompetensi":
          return (
            <Chip
              color={
                (cellValue as string) === "kompeten" ? "success" : "warning"
              }
              size="sm"
              variant="flat"
            >
              {(cellValue as string) === "kompeten"
                ? "Kompeten"
                : "Belum Kompeten"}
            </Chip>
          );
        default:
          return cellValue as ReactNode;
      }
    },
    [],
  );

  const customTopContentPeserta = useMemo(
    () => (
      <Select
        disallowEmptySelection
        className="w-full sm:max-w-[200px]"
        label="Filter Batch"
        selectedKeys={
          selectedBatch ? [selectedBatch] : ["__all__"]
        }
        size="sm"
        variant="bordered"
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0] as string;
          setSelectedBatch(key === "__all__" ? "" : key);
        }}
      >
        <SelectItem key="__all__" className="text-sm" textValue="Semua Batch">
          Semua Batch
        </SelectItem>
        {(isLoadingFilterJadwal ? (
          <SelectItem key="loading" className="text-sm" textValue="Loading...">
            Loading...
          </SelectItem>
        ) : (
          (() => {
            const allBatches = (dataFilterJadwal || [])
              .map((jadwal: any) => jadwal.batch)
              .filter(Boolean);
            const batches = allBatches.filter(
              (v: string, i: number, a: string[]) => a.indexOf(v) === i,
            );
            return batches.map((batch: string) => (
              <SelectItem
                key={batch}
                className="text-sm"
                textValue={batch}
              >
                {batch}
              </SelectItem>
            ));
          })()
        )) as any}
      </Select>
    ),
    [selectedBatch, setSelectedBatch, dataFilterJadwal, isLoadingFilterJadwal],
  );

  return (
    <section>
      {isLoadingSession ? (
        <TablePageSkeleton />
      ) : (
        <div className="flex flex-col gap-4">
          <Tabs
            aria-label="Laporan Tabs"
            selectedKey={selectedTab}
            onSelectionChange={(key) =>
              setSelectedTab(key as "sertifikat" | "peserta")
            }
          >
            <Tab key="sertifikat" title="Laporan Sertifikat">
              <DataTable
                buttonTopContentLabel="Cetak Laporan sebagai PDF"
                columns={LISTS_LAPORAN_SERTIFIKAT}
                data={dataKelolaLaporan?.data || []}
                emptyContent="Laporan sertifikat tidak ditemukan"
                isLoading={isLoadingKelolaLaporan || isRefetchingKelolaLaporan}
                placeholderTopContent="Cari Berdasarkan Nama Training..."
                renderCell={renderCellSertifikat}
                totalPages={
                  dataKelolaLaporan
                    ? dataKelolaLaporan.pagination.totalPages
                    : 1
                }
                onClickButtonTopContent={handleCetakPDF}
              />
            </Tab>
            <Tab key="peserta" title="Laporan Peserta">
              <DataTable
                buttonTopContentLabel="Cetak Laporan sebagai PDF"
                columns={LISTS_LAPORAN_PESERTA}
                customTopContent={customTopContentPeserta}
                data={dataKelolaLaporan?.data || []}
                emptyContent="Laporan peserta tidak ditemukan"
                isLoading={isLoadingKelolaLaporan || isRefetchingKelolaLaporan}
                placeholderTopContent="Cari Berdasarkan Nama Peserta..."
                renderCell={renderCellPeserta}
                totalPages={
                  dataKelolaLaporan
                    ? dataKelolaLaporan.pagination.totalPages
                    : 1
                }
                onClickButtonTopContent={handleCetakPDF}
              />
            </Tab>
          </Tabs>
        </div>
      )}
    </section>
  );
};

export default KelolaLaporan;
