"use client";

import { useQuery } from "@tanstack/react-query";

import { kelolaInstrukturAsesorServices } from "@/services/kelolaInstrukturAsesor.service";

const useDetailInstrukturAsesorModal = (id: string, isOpen: boolean) => {
  const getInstrukturAsesorById = async (id: string) => {
    const response =
      await kelolaInstrukturAsesorServices.getInstrukturOrAsesorById(id);

    return response.data;
  };

  const { data: instrukturAsesorDataById } = useQuery({
    queryKey: ["instrukturAsesor", id],
    queryFn: () => getInstrukturAsesorById(id),
    enabled: !!id && isOpen,
  });

  return {
    instrukturAsesorDataById,
  };
};

export default useDetailInstrukturAsesorModal;
