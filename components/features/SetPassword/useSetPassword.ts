import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import {
  setPasswordServices,
  CredentialPayload,
} from "@/services/setPassword.services";
import { ToasterContext } from "@/context/ToasterContext";
import errorHandling from "@/utils/errrorHandling";

const useSetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setToaster } = useContext(ToasterContext);

  const token = searchParams.get("token") || "";

  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

  const toggleVisibilityPassword = () =>
    setIsVisiblePassword(!isVisiblePassword);
  const toggleVisibilityConfirm = () => setIsVisibleConfirm(!isVisibleConfirm);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!token) {
      setToaster({
        title: "Akses Ditolak",
        type: "error",
        message: "Token tidak ditemukan.",
      });
      router.push("/login");
    }
  }, [token, router, setToaster]);

  const { mutate: handleSetPassword, isPending: isPendingSetPassword } =
    useMutation({
      mutationFn: async (data: CredentialPayload) => {
        const res = await setPasswordServices.setPassword(data);

        return res.data;
      },
      onSuccess: () => {
        setToaster({
          title: "Berhasil",
          type: "success",
          message: "Kata sandi berhasil diatur.",
        });
        router.push("/login");
      },
      onError: (error: any) => {
        const message = errorHandling(error);

        setToaster({
          title: "Gagal",
          type: "error",
          message: message || "Gagal mengatur kata sandi",
        });
      },
    });

  const onSubmit = (data: any) => {
    handleSetPassword({ token, password: data.password });
  };

  return {
    isVisiblePassword,
    isVisibleConfirm,
    toggleVisibilityPassword,
    toggleVisibilityConfirm,
    control,
    handleSubmit,
    onSubmit,
    isPendingSetPassword,
    errors,
    watch,
  };
};

export default useSetPassword;
