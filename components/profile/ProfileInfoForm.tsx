"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

import useProfileInfo from "./useProfileInfo";

const ProfileInfoForm = () => {
  const { form, loading, submitting, handleChange, handleSubmit } =
    useProfileInfo();

  if (loading) {
    return (
      <Card>
        <CardBody>
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-lg flex flex-col gap-1">
              <Spinner className="animate-spin" color="default" />
              <span className="text-brand text-sm font-medium">
                Sedang memuat profil...
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-brand">Informasi Profil</h2>
          <p className="text-sm text-default-600">
            Kelola Informasi Pengguna Akun ini
          </p>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <Input
          label="Nama Lengkap"
          value={form.name}
          onValueChange={(value) => handleChange("name", value)}
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onValueChange={(value) => handleChange("email", value)}
        />
        <Input
          label="No. WhatsApp"
          value={form.noWa}
          onValueChange={(value) => handleChange("noWa", value)}
        />
        <div className="flex justify-end pt-2">
          <Button
            className="bg-brand text-white"
            isLoading={submitting}
            onPress={handleSubmit}
          >
            Simpan
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProfileInfoForm;
