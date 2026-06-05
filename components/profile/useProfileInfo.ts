"use client";

import type { IUpdateProfileRequest } from "@/types/profile";

import { useContext, useEffect, useState } from "react";

import { profileServices } from "@/services/profile.service";
import { ToasterContext } from "@/context/ToasterContext";

type payloadProfile = {
  name: string;
  email: string;
  noWa: string;
};

const useProfileInfo = () => {
  const { setToaster } = useContext(ToasterContext);
  const [form, setForm] = useState<IUpdateProfileRequest>({
    name: "",
    email: "",
    noWa: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileServices.getProfile();
      const data = response.data?.data;

      if (data) {
        setForm({
          name: data.name || "",
          email: data.email || "",
          noWa: data.noWa || "",
        });
      }
    } catch {
      setToaster({
        type: "error",
        title: "Gagal",
        message: "Gagal memuat profil",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof IUpdateProfileRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await profileServices.updateProfile(form as payloadProfile);
      setToaster({
        type: "success",
        title: "Berhasil",
        message: "Profil berhasil diperbarui",
      });
    } catch {
      setToaster({
        type: "error",
        title: "Gagal",
        message: "Gagal memperbarui profil",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return { form, loading, submitting, handleChange, handleSubmit };
};

export default useProfileInfo;
