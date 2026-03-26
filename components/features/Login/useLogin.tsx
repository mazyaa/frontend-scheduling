"use client";

import { useContext, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession, signIn, signOut } from "next-auth/react";

import { ILogin } from "@/types/Auth";
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
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined; // e.g user access page protected page without login, it will redirect to login page with callbackUrl query parameter, after successful login it will redirect back to the protected page
  const { setToaster } = useContext(ToasterContext);

  // hooks from react for form handling
  const {
    control, // for controlling form inputs (get value, set value, etc.)
    handleSubmit,
    formState: { errors },
    reset, // handling error manually from api response
  } = useForm({
    resolver: yupResolver(loginSchema), // use function yupResolver form validation previously defined schema
  });

  // function for registering user
  const loginServices = async (payload: ILogin) => {
    const result = await signIn("credentials", {
      // use signIn from next-auth for handling login with credentials provider
      ...payload,
      redirect: false,
      callbackUrl,
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
      const session = await getSession();
      const role = session?.user?.role;

      setToaster({
        title: "Login Success",
        type: "success",
        message: `Hello!, welcome back ${session?.user?.name || "bro"}`,
      });

      const roleRoutes: Record<string, string> = {
        peserta: "/",
        instruktur: "/",
        admin: "/admin/dashboard",
        asesor: "/",
        direktur: "/direktur/dashboard",
      };

      // check if user is provided then set the roleRedirect based on the user's role
      const roleRedirect = role ? roleRoutes[role] : null;

      // parsed callbackUrl to pathname e.g http://localhost:3000/admin/dashboard => /admin/dashboard
      const parsedCallback = callbackUrl
        ? new URL(callbackUrl, window.location.origin).pathname
        : null;

      // redirect if callback is provided, and use roleRedirect if callback is not provided
      const redirectUrl =
        parsedCallback && parsedCallback !== "/"
          ? parsedCallback
          : roleRedirect || "/";

      router.push(redirectUrl);
    },
  });

  // function for handling form submission
  const handleLogin = (data: ILogin) => mutateLogin(data);
  const handleLogout = async () => {
    await signOut({ redirect: false });

    setToaster({
      title: "Logout Success",
      type: "success",
      message: "You have been logged out",
    });

    router.push("/");
  };

  return {
    isVisible,
    toggleVisibility,
    control,
    handleSubmit,
    handleLogin,
    reset,
    isPendingLogin,
    errors,
    handleLogout,
  };
};

export default useLogin;
