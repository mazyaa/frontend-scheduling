"use client";

import Image from "next/image";
import { cn } from "tailwind-variants";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Controller } from "react-hook-form";
import { Spinner } from "@heroui/spinner";

import useSetPassword from "./useSetPassword";

import GridBackground from "@/components/GridBackground";

export default function SetPassword() {
  const {
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
  } = useSetPassword();

  return (
    <>
      <GridBackground />
      <div className="flex h-full w-full items-center justify-center gap-10 py-10 flex-col lg:flex-row lg:gap-20">
        <Image
          alt="icon-login"
          className="z-999 lg:w-md w-sm"
          height={400}
          src="/Images/iconLogin.png"
          width={400}
        />

        <Card>
          <CardBody className="p-4 lg:p-8">
            <div className="mb-5 flex flex-col gap-3">
              <h1 className="text-2xl font-semibold text-brand lg:text-2xl">
                Set Password
              </h1>
              <p className="text-small">
                Silahkan atur kata sandi baru untuk akun Anda.
              </p>
            </div>

            <form
              className={cn(
                "flex w-80 flex-col",
                Object.keys(errors).length > 0 ? "gap-2" : "gap-3",
              )}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    {...field}
                    autoComplete="off"
                    className="mb-4"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibilityPassword}
                      >
                        {isVisiblePassword ? (
                          <FaEye className="text-xl text-default-400" />
                        ) : (
                          <FaEyeSlash className="text-xl text-danger-500" />
                        )}
                      </button>
                    }
                    errorMessage={errors.password?.message as string}
                    isInvalid={errors.password !== undefined}
                    label="Password"
                    type={isVisiblePassword ? "text" : "password"}
                    variant="bordered"
                  />
                )}
                rules={{
                  required: "Password wajib diisi",
                  minLength: { value: 6, message: "Minimal 6 karakter" },
                }}
              />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <Input
                    {...field}
                    autoComplete="off"
                    className="mb-4"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibilityConfirm}
                      >
                        {isVisibleConfirm ? (
                          <FaEye className="text-xl text-default-400" />
                        ) : (
                          <FaEyeSlash className="text-xl text-danger-500" />
                        )}
                      </button>
                    }
                    errorMessage={errors.confirmPassword?.message as string}
                    isInvalid={errors.confirmPassword !== undefined}
                    label="Ulangi Password"
                    type={isVisibleConfirm ? "text" : "password"}
                    variant="bordered"
                  />
                )}
                rules={{
                  required: "Konfirmasi password wajib diisi",
                  validate: (val) => {
                    if (watch("password") != val) {
                      return "Ulangi password tidak sama dengan password";
                    }
                  },
                }}
              />
              <Button className="bg-brand text-white" size="lg" type="submit">
                {isPendingSetPassword ? (
                  <Spinner className="h-5 w-5" color="default" variant="wave" />
                ) : (
                  "Simpan"
                )}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
