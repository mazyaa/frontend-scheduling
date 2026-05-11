import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";

import { kredensialServices } from "@/services/kredensial.services";
import { ToasterContext } from "@/context/ToasterContext";
import errorHandling from "@/utils/errrorHandling";

const useKirimKredensial = () => {
  const { setToaster } = useContext(ToasterContext);

  const { mutate: handleKirimKredensial, isPending: isPendingKirimKredensial } =
    useMutation({
      mutationFn: async (id: string) => {
        const res = await kredensialServices.createCredential(id);

        return res.data;
      },
      onSuccess: ({ data }) => {
        setToaster({
          title: "Berhasil",
          type: "success",
          message: "Berhasil mengirim kredensial",
        });

        if (data && data.message) {
          window.open(data.message, "_blank");
        }
      },
      onError: (error: any) => {
        const message = errorHandling(error);

        setToaster({
          title: "Gagal mengirim kredensial",
          type: "error",
          message: message || "Terjadi kesalahan",
        });
      },
    });

  return { isPendingKirimKredensial, handleKirimKredensial };
};

export default useKirimKredensial;
