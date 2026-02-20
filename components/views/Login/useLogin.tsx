"use client";

import { useContext, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ILogin } from "@/types/Auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { ToasterContext } from "@/context/ToasterContext";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Please input your email"),
  password: yup.string().required("Please input your password"),
});

const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // for getting query parameters from URL (e.g., callbackUrl)
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const callbackUrl: string =
    (searchParams.get("callbackUrl") as string) || "/"; // e.g user access page protected page without login, it will redirect to login page with callbackUrl query parameter, after successful login it will redirect back to the protected page
  const { setToaster } = useContext(ToasterContext);

  // hooks from react for form handling
  //destructuring control, handleSubmit, formState, reset, setError from useForm
  const {
    control, // for controlling form inputs (get value, set value, etc.)
    handleSubmit,
    formState: { errors },
    reset,
    setError, // handling error manually from api response
  } = useForm({
    resolver: yupResolver(loginSchema), // use function yupResolver form validation previously defined schema
  });

  // function for registering user
  const loginServices = async (payload: ILogin) => {
    const result = await signIn("credentials", {
      // use signIn from next-auth for handling login with credentials provider
      ...payload,
      redirect: false,
      callbackUrl: "/",
    });
    if (result?.error && result?.status === 401) {
      throw new Error("Email is not matched with your password");
    }
  };

  // useMutation from react-query for handling requests (POST)
  const { mutate: mutateLogin, isPending: isPendingLogin } = useMutation({
    mutationFn: loginServices,
    onError(error) {
      setToaster({
        title: "Login Failed",
        type: "error",
        message: (error as Error).message,
      });
    },
    onSuccess: async () => {
      reset(); // reset form after successful registration
      setToaster({
        title: "Login Success",
        type: "success",
        message: "Login successfully!",
      });
      const session = await getSession();
      const role = session?.user?.role;

      const roleRoutes: Record<string, string> = {
        peserta: "/peserta/dashboard",
        instruktur: "/instruktur/dashboard",
        admin: "/",
        asesor: "/asesor/dashboard",
        direktur: "/direktur/dashboard",
      };
        
      const redirectUrl = (role && roleRoutes[role]) || callbackUrl || "/";
      router.push(redirectUrl);
    },
  });

  // function for handling form submission
  const handleLogin = (data: ILogin) => mutateLogin(data);

  return {
    isVisible,
    toggleVisibility,
    control,
    handleSubmit,
    handleLogin,
    reset,
    isPendingLogin,
    errors,
  };
};

export default useLogin;
