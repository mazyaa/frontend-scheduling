"use client";

import type { IChangePasswordRequest } from "@/types/profile";

import { useContext, useState } from "react";

import { profileServices } from "@/services/profile.service";
import { ToasterContext } from "@/context/ToasterContext";

const initialForm: IChangePasswordRequest = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const useProfileSecurity = () => {
  const { setToaster } = useContext(ToasterContext);
  const [form, setForm] = useState<IChangePasswordRequest>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof IChangePasswordRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      setToaster({
        type: "error",
        title: "Gagal",
        message: "Password baru tidak cocok",
      });

      return;
    }

    try {
      setSubmitting(true);
      await profileServices.changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });
      setToaster({
        type: "success",
        title: "Berhasil",
        message: "Password berhasil diubah",
      });
      setForm(initialForm);
    } catch {
      setToaster({
        type: "error",
        title: "Gagal",
        message: "Gagal mengubah password",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return { form, submitting, handleChange, handleSubmit };
};

export default useProfileSecurity;
