import { useMutation } from "@tanstack/react-query";

import { showToast } from "@/lib/toast";
import {
  loginService,
  logoutService,
  signupService,
} from "../services/authService";
export const useAuth = () => {
  const login = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return await loginService(email, password);
    },
    onSuccess: (data) => {
      console.log("LOGIN DATA", data);
      showToast("Logged In", "success");
    },
    onError: (error: any) => {
      showToast(error.response.data.message || "Auth error", "error");
    },
  });

  const signUp = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return await signupService(email, password);
    },
    onSuccess: (data) => {
      console.log("data", data);
      showToast("Success", "success");
    },
    onError: (error: any) => {
      console.log("err", error);
      showToast(error.response.data.message || "Auth error", "error");
    },
  });

  const signOut = async () => {
    await logoutService();
  };
  return { login, signUp, signOut };
};
