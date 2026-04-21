"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import useChangeUrl from "@/hooks/useChangeUrl";
import { kelolaDetailJadwalServices } from "@/services/kelolaDetailJadwal.service";
import { kelolaInstrukturAsesorServices } from "@/services/kelolaInstrukturAsesor.service";

type TDetailJadwalPerson = {
  id?: string | number | null;
  name?: string | null;
};

type TDetailJadwalRow = {
  id: string | number;
  hari?: string | Date;
  hariKe?: string | number;
  instrukturId?: string | number | null;
  asesorId?: string | number | null;
  instruktur_id?: string | number | null;
  asesor_id?: string | number | null;
  instrukturName?: string | null;
  asesorName?: string | null;
  nama_instruktur?: string | null;
  nama_asesor?: string | null;
  instruktur?: TDetailJadwalPerson | null;
  asesor?: TDetailJadwalPerson | null;
  [key: string]: unknown;
};

const toStringId = (value: unknown) =>
  value === null || value === undefined ? "" : String(value);

const getPersonIdFromRow = (
  row: TDetailJadwalRow,
  role: "instruktur" | "asesor",
) => {
  if (role === "instruktur") {
    return toStringId(
      row.instrukturId ?? row.instruktur?.id ?? row.instruktur_id,
    );
  }

  return toStringId(row.asesorId ?? row.asesor?.id ?? row.asesor_id);
};

const getPersonNameFallbackFromRow = (
  row: TDetailJadwalRow,
  role: "instruktur" | "asesor",
) => {
  if (role === "instruktur") {
    return (
      row.nama_instruktur || row.instruktur?.name || row.instrukturName || ""
    );
  }

  return row.nama_asesor || row.asesor?.name || row.asesorName || "";
};

const useDetailJadwal = () => {
  // const pathname = usePathname();
  const params = useParams();
  const id = params.id;
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [selectedId, setSelectedId] = useState<string>("");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getAllDetailSchedule = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    const response = await kelolaDetailJadwalServices.getAllDetailJadwal(
      id as string,
      params,
    );

    const { data, pagination } = response.data;
    const rows = (data || []) as TDetailJadwalRow[];
    const sortedData = [...rows].sort((a, b) => {
      const hariKeA = Number(a?.hariKe || 0);
      const hariKeB = Number(b?.hariKe || 0);

      if (hariKeA !== hariKeB) {
        return hariKeA - hariKeB;
      }

      const tanggalA = new Date(a?.hari || 0).getTime();
      const tanggalB = new Date(b?.hari || 0).getTime();

      return tanggalA - tanggalB;
    });

    return {
      data: sortedData,
      pagination,
    };
  };

  const {
    data: rawDataDetailJadwal,
    isLoading: isLoadiangDetailJadwal,
    isRefetching: isRefetchingDetailJadwal,
    refetch: refetchDetailKelolaJadwal,
  } = useQuery({
    queryKey: [
      "DetailKelolaJadwal",
      id,
      currentPage,
      currentLimit,
      currentSearch,
    ],
    queryFn: getAllDetailSchedule,
    enabled: !!id && !!currentPage && !!currentLimit && !!token,
  });

  const uniquePersonIds = useMemo(() => {
    const rows = (rawDataDetailJadwal?.data || []) as TDetailJadwalRow[];

    return Array.from(
      new Set(
        rows
          .flatMap((row) => [
            getPersonIdFromRow(row, "instruktur"),
            getPersonIdFromRow(row, "asesor"),
          ])
          .filter((personId: string | undefined) => !!personId),
      ),
    ).sort() as string[];
  }, [rawDataDetailJadwal]);

  const getPersonNameMapByIds = async (personIds: string[]) => {
    const response =
      await kelolaInstrukturAsesorServices.getAllInstrukturAndAsesor(
        "limit=1000&page=1",
      );
    const allPersons = (response.data?.data || []) as Array<{
      id?: string | number;
      name?: string;
    }>;
    const requestedIds = new Set(personIds);

    return allPersons.reduce<Record<string, string>>((acc, person) => {
      const currentId = toStringId(person.id);

      if (!currentId || !requestedIds.has(currentId)) {
        return acc;
      }

      acc[currentId] = person.name || "-";

      return acc;
    }, {});
  };

  const { data: personNameById = {}, isLoading: isLoadingPersonNameById } =
    useQuery({
      queryKey: ["DetailJadwalPersonNameMap", uniquePersonIds.join(",")],
      enabled: uniquePersonIds.length > 0 && !!token,
      queryFn: () => getPersonNameMapByIds(uniquePersonIds),
    });

  const dataDetailJadwal = useMemo(() => {
    if (!rawDataDetailJadwal) {
      return undefined;
    }

    const mappedRows = (rawDataDetailJadwal.data as TDetailJadwalRow[]).map(
      (row) => {
        const instrukturId = getPersonIdFromRow(row, "instruktur");
        const asesorId = getPersonIdFromRow(row, "asesor");
        const fallbackInstruktur = getPersonNameFallbackFromRow(
          row,
          "instruktur",
        );
        const fallbackAsesor = getPersonNameFallbackFromRow(row, "asesor");

        return {
          ...row,
          nama_instruktur:
            personNameById[instrukturId] || fallbackInstruktur || "-",
          nama_asesor: personNameById[asesorId] || fallbackAsesor || "-",
        };
      },
    );

    return {
      ...rawDataDetailJadwal,
      data: mappedRows,
    };
  }, [personNameById, rawDataDetailJadwal]);

  return {
    dataDetailJadwal,
    isLoadiangDetailJadwal,
    isRefetchingDetailJadwal,
    refetchDetailKelolaJadwal,

    selectedId,
    setSelectedId,

    isLoadingPersonNameById,
  };
};

export default useDetailJadwal;
