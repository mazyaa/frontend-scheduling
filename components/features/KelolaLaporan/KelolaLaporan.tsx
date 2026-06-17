"use client";

import { useSearchParams } from "next/navigation";
import {
  Key,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const uniqueValues = (arr: any[], key: string): string[] => {
  const vals = arr
    .map((item: any) => {
      const v = key.split(".").reduce((obj, k) => obj?.[k], item);

      return v ? String(v) : null;
    })
    .filter(Boolean);

  return [...new Set(vals)].sort();
};

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
    selectedTahun,
    setSelectedTahun,
    selectedStatus,
    setSelectedStatus,
    dataFilterJadwal,
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

    const title = isSertifikat ? "Laporan Sertifikat" : "Laporan Peserta";
    const orientation = isSertifikat ? "portrait" : "landscape";

    const formatDatePDF = (dateStr: string) => {
      if (!dateStr) return "-";
      try {
        return new Date(dateStr).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      } catch {
        return dateStr;
      }
    };

    const filterParts: string[] = [];

    if (selectedBatch) filterParts.push(`Batch: ${selectedBatch}`);
    if (selectedTahun) filterParts.push(`Tahun: ${selectedTahun}`);
    if (selectedStatus)
      filterParts.push(
        `Status: ${selectedStatus === "kompeten" ? "Kompeten" : "Belum Kompeten"}`,
      );
    const filterInfo =
      filterParts.length > 0
        ? `<p style="font-size:11px;color:#6b7280;margin-top:4px">${filterParts.join(" &middot; ")}</p>`
        : "";

    const sertifikatHeaders = `<tr>
      <th style="border:1px solid #d1d5db;padding:10px 12px;background:#1a1f36;color:#fff;text-align:center;font-weight:600;font-size:11px">No</th>
      <th style="border:1px solid #d1d5db;padding:10px 12px;background:#1a1f36;color:#fff;text-align:left;font-weight:600;font-size:11px">Nama Training</th>
      <th style="border:1px solid #d1d5db;padding:10px 12px;background:#1a1f36;color:#fff;text-align:center;font-weight:600;font-size:11px">Batch</th>
      <th style="border:1px solid #d1d5db;padding:10px 12px;background:#1a1f36;color:#fff;text-align:center;font-weight:600;font-size:11px">Tgl Mulai</th>
      <th style="border:1px solid #d1d5db;padding:10px 12px;background:#1a1f36;color:#fff;text-align:center;font-weight:600;font-size:11px">Tgl Selesai</th>
      <th style="border:1px solid #d1d5db;padding:10px 12px;background:#1a1f36;color:#fff;text-align:center;font-weight:600;font-size:11px">Total Peserta</th>
      <th style="border:1px solid #d1d5db;padding:10px 12px;background:#1a1f36;color:#fff;text-align:center;font-weight:600;font-size:11px">Terbit</th>
      <th style="border:1px solid #d1d5db;padding:10px 12px;background:#1a1f36;color:#fff;text-align:center;font-weight:600;font-size:11px">Belum Terbit</th>
    </tr>`;

    const totalPesertaAll = data.reduce(
      (sum: number, item: any) => sum + (item.totalPeserta ?? 0),
      0,
    );
    const totalTerbitAll = data.reduce(
      (sum: number, item: any) => sum + (item.totalSertifikatTerbit ?? 0),
      0,
    );
    const totalBelumAll = data.reduce(
      (sum: number, item: any) => sum + (item.totalBelumTerbit ?? 0),
      0,
    );

    const sertifikatBody = data
      .map((item: any, i: number) => {
        const bg = i % 2 === 0 ? "#f9fafb" : "#fff";

        return `<tr style="background:${bg}">
          <td style="border:1px solid #d1d5db;padding:7px 12px;text-align:center;font-size:11px">${i + 1}</td>
          <td style="border:1px solid #d1d5db;padding:7px 12px;font-size:11px">${item.namaTraining || "-"}</td>
          <td style="border:1px solid #d1d5db;padding:7px 12px;text-align:center;font-size:11px">${item.batch || "-"}</td>
          <td style="border:1px solid #d1d5db;padding:7px 12px;text-align:center;font-size:11px">${formatDatePDF(item.startDate)}</td>
          <td style="border:1px solid #d1d5db;padding:7px 12px;text-align:center;font-size:11px">${formatDatePDF(item.endDate)}</td>
          <td style="border:1px solid #d1d5db;padding:7px 12px;text-align:center;font-size:11px">${item.totalPeserta ?? 0}</td>
          <td style="border:1px solid #d1d5db;padding:7px 12px;text-align:center;font-size:11px;font-weight:600;color:#16a34a">${item.totalSertifikatTerbit ?? 0}</td>
          <td style="border:1px solid #d1d5db;padding:7px 12px;text-align:center;font-size:11px;font-weight:600;color:#dc2626">${item.totalBelumTerbit ?? 0}</td>
        </tr>`;
      })
      .join("");

    const sertifikatSummary = `<tr style="background:#f0fdf4;font-weight:700">
      <td style="border:1px solid #d1d5db;padding:8px 12px;text-align:center;font-size:11px" colspan="5">TOTAL</td>
      <td style="border:1px solid #d1d5db;padding:8px 12px;text-align:center;font-size:11px">${totalPesertaAll}</td>
      <td style="border:1px solid #d1d5db;padding:8px 12px;text-align:center;font-size:11px;color:#16a34a">${totalTerbitAll}</td>
      <td style="border:1px solid #d1d5db;padding:8px 12px;text-align:center;font-size:11px;color:#dc2626">${totalBelumAll}</td>
    </tr>`;

    const totalPesertaCount = data.length;
    const kompetenCount = data.filter(
      (d: any) => d.statusKompetensi === "kompeten",
    ).length;
    const belumKompetenCount = totalPesertaCount - kompetenCount;

    const pesertaHeaders = `<tr>
      <th style="border:1px solid #d1d5db;padding:8px 10px;background:#1a1f36;color:#fff;text-align:center;font-weight:600;font-size:10px">No</th>
      <th style="border:1px solid #d1d5db;padding:8px 10px;background:#1a1f36;color:#fff;text-align:left;font-weight:600;font-size:10px">Nama Peserta</th>
      <th style="border:1px solid #d1d5db;padding:8px 10px;background:#1a1f36;color:#fff;text-align:left;font-weight:600;font-size:10px">Email</th>
      <th style="border:1px solid #d1d5db;padding:8px 10px;background:#1a1f36;color:#fff;text-align:center;font-weight:600;font-size:10px">No. WA</th>
      <th style="border:1px solid #d1d5db;padding:8px 10px;background:#1a1f36;color:#fff;text-align:left;font-weight:600;font-size:10px">Instansi</th>
      <th style="border:1px solid #d1d5db;padding:8px 10px;background:#1a1f36;color:#fff;text-align:left;font-weight:600;font-size:10px">Nama Training</th>
      <th style="border:1px solid #d1d5db;padding:8px 10px;background:#1a1f36;color:#fff;text-align:center;font-weight:600;font-size:10px">Batch</th>
      <th style="border:1px solid #d1d5db;padding:8px 10px;background:#1a1f36;color:#fff;text-align:center;font-weight:600;font-size:10px">Status Kompetensi</th>
      <th style="border:1px solid #d1d5db;padding:8px 10px;background:#1a1f36;color:#fff;text-align:center;font-weight:600;font-size:10px">Status Revisi</th>
      <th style="border:1px solid #d1d5db;padding:8px 10px;background:#1a1f36;color:#fff;text-align:center;font-weight:600;font-size:10px">Tgl Dibuat</th>
    </tr>`;

    const pesertaBody = data
      .map((item: any, i: number) => {
        const bg = i % 2 === 0 ? "#f9fafb" : "#fff";
        const kompetensiBadge =
          item.statusKompetensi === "kompeten"
            ? `<span style="display:inline-block;padding:1px 8px;border-radius:9999px;font-size:10px;background:#dcfce7;color:#16a34a;font-weight:600">Kompeten</span>`
            : `<span style="display:inline-block;padding:1px 8px;border-radius:9999px;font-size:10px;background:#fef3c7;color:#d97706;font-weight:600">Belum Kompeten</span>`;

        const revisiStyles: Record<string, { bg: string; color: string }> = {
          pending: { bg: "#fef3c7", color: "#d97706" },
          disetujui: { bg: "#dcfce7", color: "#16a34a" },
          ditolak: { bg: "#fee2e2", color: "#dc2626" },
        };
        const rs = revisiStyles[item.statusRevisi] || {
          bg: "#f3f4f6",
          color: "#6b7280",
        };
        const revisiBadge = item.statusRevisi
          ? `<span style="display:inline-block;padding:1px 8px;border-radius:9999px;font-size:10px;background:${rs.bg};color:${rs.color};font-weight:600">${item.statusRevisi}</span>`
          : `<span style="font-size:10px;color:#9ca3af">-</span>`;

        return `<tr style="background:${bg}">
          <td style="border:1px solid #d1d5db;padding:6px 10px;text-align:center;font-size:10px">${i + 1}</td>
          <td style="border:1px solid #d1d5db;padding:6px 10px;font-size:10px">${item.namaPeserta || "-"}</td>
          <td style="border:1px solid #d1d5db;padding:6px 10px;font-size:10px">${item.email || "-"}</td>
          <td style="border:1px solid #d1d5db;padding:6px 10px;text-align:center;font-size:10px">${item.noWa || "-"}</td>
          <td style="border:1px solid #d1d5db;padding:6px 10px;font-size:10px">${item.instansi || "-"}</td>
          <td style="border:1px solid #d1d5db;padding:6px 10px;font-size:10px">${item.namaTraining || "-"}</td>
          <td style="border:1px solid #d1d5db;padding:6px 10px;text-align:center;font-size:10px">${item.batch || "-"}</td>
          <td style="border:1px solid #d1d5db;padding:6px 10px;text-align:center;font-size:10px">${kompetensiBadge}</td>
          <td style="border:1px solid #d1d5db;padding:6px 10px;text-align:center;font-size:10px">${revisiBadge}</td>
          <td style="border:1px solid #d1d5db;padding:6px 10px;text-align:center;font-size:10px">${formatDatePDF(item.createdAt)}</td>
        </tr>`;
      })
      .join("");

    const pesertaSummary = `<tr style="background:#f0fdf4;font-weight:700">
      <td style="border:1px solid #d1d5db;padding:7px 10px;text-align:center;font-size:10px" colspan="7">TOTAL DATA: ${totalPesertaCount}</td>
      <td style="border:1px solid #d1d5db;padding:7px 10px;text-align:center;font-size:10px;color:#16a34a">${kompetenCount} Kompeten</td>
      <td style="border:1px solid #d1d5db;padding:7px 10px;text-align:center;font-size:10px;color:#d97706">${belumKompetenCount} Belum Kompeten</td>
      <td style="border:1px solid #d1d5db;padding:7px 10px;text-align:center;font-size:10px">-</td>
    </tr>`;

    const tableHeader = isSertifikat ? sertifikatHeaders : pesertaHeaders;
    const tableBody = isSertifikat ? sertifikatBody : pesertaBody;
    const tableSummary = isSertifikat ? sertifikatSummary : pesertaSummary;

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { margin: 20mm 15mm; size: A4 ${orientation}; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 0; color: #1f2937; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 3px solid #1a1f36; }
            .header img { height: 45px; margin-bottom: 8px; }
            .header h1 { font-size: 18px; font-weight: 700; color: #1a1f36; margin-bottom: 2px; letter-spacing: 0.5px; }
            .header p { font-size: 11px; color: #6b7280; margin: 2px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${window.location.origin}/Images/general/veritrust-logo.png" alt="Veritrust Logo" />
            <h1>${title}</h1>
            <p>Dicetak pada ${now}</p>
            ${filterInfo}
          </div>
          <table>
            <thead>${tableHeader}</thead>
            <tbody>${tableBody}${tableSummary}</tbody>
          </table>
          <div class="footer">
            Dokumen ini dicetak secara otomatis dari sistem Veritrust
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); window.close(); }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }, [
    dataKelolaLaporan,
    selectedTab,
    selectedBatch,
    selectedTahun,
    selectedStatus,
  ]);

  const renderCellSertifikat = useCallback(
    (item: Record<string, unknown>, columnKey: Key): ReactNode => {
      switch (columnKey) {
        case "namaTraining":
          return ((item as any)?.namaTraining as ReactNode) || "-";
        case "batch":
          return ((item as any)?.batch as ReactNode) || "-";
        case "startDate":
          return formatDate((item as any)?.startDate);
        case "endDate":
          return formatDate((item as any)?.endDate);
        case "totalPeserta":
          return (item as any)?.totalPeserta ?? 0;
        case "totalSertifikatTerbit":
          return (item as any)?.totalSertifikatTerbit ?? 0;
        case "totalBelumTerbit":
          return (item as any)?.totalBelumTerbit ?? 0;
        default:
          return null;
      }
    },
    [],
  );

  const renderCellPeserta = useCallback(
    (item: Record<string, unknown>, columnKey: Key): ReactNode => {
      switch (columnKey) {
        case "namaPeserta":
          return ((item as any)?.namaPeserta as ReactNode) || "-";
        case "email":
          return ((item as any)?.email as ReactNode) || "-";
        case "noWa":
          return ((item as any)?.noWa as ReactNode) || "-";
        case "instansi":
          return ((item as any)?.instansi as ReactNode) || "-";
        case "namaTraining":
          return ((item as any)?.namaTraining as ReactNode) || "-";
        case "batch":
          return ((item as any)?.batch as ReactNode) || "-";
        case "statusKompetensi":
          const status = (item as any)?.statusKompetensi as string;

          return (
            <Chip
              color={status === "kompeten" ? "success" : "warning"}
              size="sm"
              variant="flat"
            >
              {status === "kompeten" ? "Kompeten" : "Belum Kompeten"}
            </Chip>
          );
        case "statusRevisi":
          const rev = (item as any)?.statusRevisi as string;
          const colorMapRev: Record<
            string,
            "success" | "danger" | "warning" | "default"
          > = {
            pending: "warning",
            disetujui: "success",
            ditolak: "danger",
          };

          if (!rev) return <span className="text-xs text-gray-400">-</span>;

          return (
            <Chip
              color={colorMapRev[rev] || "default"}
              size="sm"
              variant="flat"
            >
              {rev}
            </Chip>
          );
        case "createdAt":
          return formatDate((item as any)?.createdAt);
        default:
          return null;
      }
    },
    [],
  );

  const filterSelect = useCallback(
    (
      label: string,
      value: string,
      onChange: (v: string) => void,
      options: { key: string; label: string }[],
    ) => (
      <Select
        disallowEmptySelection
        className="w-full sm:max-w-[280px]"
        label={label}
        selectedKeys={value ? [value] : ["__all__"]}
        size="sm"
        variant="bordered"
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0] as string;

          onChange(key === "__all__" ? "" : key);
        }}
      >
        <SelectItem
          key="__all__"
          className="text-sm"
          textValue={`Semua ${label}`}
        >
          Semua
        </SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.key} className="text-sm" textValue={opt.label}>
            {opt.label}
          </SelectItem>
        ))}
      </Select>
    ),
    [],
  );

  const batches = useMemo(
    () => (dataFilterJadwal ? uniqueValues(dataFilterJadwal, "batch") : []),
    [dataFilterJadwal],
  );

  const years = useMemo(
    () =>
      dataFilterJadwal
        ? uniqueValues(dataFilterJadwal, "startDate")
            .map((d) => new Date(d).getFullYear())
            .filter((y) => !isNaN(y))
            .filter((y, i, a) => a.indexOf(y) === i)
            .sort()
            .map(String)
        : [],
    [dataFilterJadwal],
  );

  const customTopContentSertifikat = useMemo(
    () => (
      <div className="flex flex-col lg:flex-row lg:w-100 gap-2">
        {filterSelect(
          "Batch",
          selectedBatch,
          setSelectedBatch,
          batches.map((b: string) => ({ key: b, label: b })),
        )}
        {filterSelect(
          "Tahun",
          selectedTahun,
          setSelectedTahun,
          years.map((y: string) => ({ key: y, label: y })),
        )}
      </div>
    ),
    [
      selectedBatch,
      setSelectedBatch,
      selectedTahun,
      setSelectedTahun,
      batches,
      years,
      filterSelect,
    ],
  );

  const customTopContentPeserta = useMemo(
    () => (
      <div className="flex flex-col lg:flex-row lg:w-150 gap-2">
        {filterSelect(
          "Batch",
          selectedBatch,
          setSelectedBatch,
          batches.map((b: string) => ({ key: b, label: b })),
        )}
        {filterSelect(
          "Tahun",
          selectedTahun,
          setSelectedTahun,
          years.map((y: string) => ({ key: y, label: y })),
        )}
        {filterSelect("Status", selectedStatus, setSelectedStatus, [
          { key: "kompeten", label: "Kompeten" },
          { key: "belum_kompeten", label: "Belum Kompeten" },
        ])}
      </div>
    ),
    [
      selectedBatch,
      setSelectedBatch,
      selectedTahun,
      setSelectedTahun,
      selectedStatus,
      setSelectedStatus,
      batches,
      years,
      filterSelect,
    ],
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
                customTopContent={customTopContentSertifikat}
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
