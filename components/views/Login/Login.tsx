"use client";

import GridBackground from "@/components/GridBackground";
import Image from "next/image";
import Link from "next/link";
import { cn } from "tailwind-variants";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import useLogin from "./useLogin";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Controller } from "react-hook-form";
import { Spinner } from "@heroui/spinner";

export default function Login() {
  const {
    isVisible,
    toggleVisibility,
    control,
    handleSubmit,
    handleLogin,
    isPendingLogin,
    errors,
  } = useLogin();

  return (
    <>
      <GridBackground />
      <div className="flex h-full w-full items-center justify-center gap-10 py-10 flex-col lg:flex-row lg:gap-20">
        <Image
          src="/images/iconLogin.png"
          alt="icon-login"
          width={400}
          height={400}
          className="z-999 lg:w-md w-sm"
        />

        <Card>
          <CardBody className="p-4 lg:p-8">
            <div className="mb-5 flex flex-col gap-3">
              <h1 className="text-2xl font-semibold text-brand lg:text-2xl">
                Login
              </h1>
              <p className="text-small">
                Silahkan&nbsp;
                <span className="font-semibold text-brand">Login</span>
                &nbsp;Terlebih Dahulu!
              </p>
            </div>

            {errors.root && (
              <p className="mb-2 text-sm font-medium text-danger">
                {errors?.root?.message}
              </p>
            )}

            <form
              className={cn(
                "flex w-80 flex-col",
                Object.keys(errors).length > 0 ? "gap-2" : "gap-3",
              )}
              onSubmit={handleSubmit(handleLogin)}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    label="Email or Username"
                    variant="bordered"
                    className="mb-4"
                    autoComplete="off"
                    isInvalid={errors.email !== undefined}
                    errorMessage={errors.email?.message}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type={isVisible ? "text" : "password"}
                    label="Password"
                    variant="bordered"
                    className="mb-4"
                    autoComplete="off"
                    isInvalid={errors.password !== undefined}
                    errorMessage={errors.password?.message}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() => toggleVisibility()}
                      >
                        {isVisible ? (
                          <FaEye className="text-xl text-default-400" />
                        ) : (
                          <FaEyeSlash className="text-xl text-danger-500" />
                        )}
                      </button>
                    }
                  />
                )}
              />
              <Button className="bg-brand text-white" size="lg" type="submit">
                {isPendingLogin ? (
                  <Spinner
                    color="default"
                    className="mb-3 h-5 w-5"
                    variant="wave"
                  />
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
