"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import useProfileSecurity from "./useProfileSecurity";

const ProfileSecurityForm = () => {
  const { form, submitting, handleChange, handleSubmit } = useProfileSecurity();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-brand">Keamanan</h2>
          <p className="text-sm text-default-600">
            Kelola keamanan akun anda dengan mengubah password secara berkala!
          </p>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <Input
          label="Password Lama"
          type="password"
          value={form.oldPassword}
          onValueChange={(value) => handleChange("oldPassword", value)}
        />
        <Input
          label="Password Baru"
          type="password"
          value={form.newPassword}
          onValueChange={(value) => handleChange("newPassword", value)}
        />
        <Input
          label="Konfirmasi Password Baru"
          type="password"
          value={form.confirmPassword}
          onValueChange={(value) => handleChange("confirmPassword", value)}
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

export default ProfileSecurityForm;
