import { useMutation } from "@tanstack/react-query";

import { showToast } from "@/lib/toast";
import {
  loginService,
  logoutService,
  signupService,
} from "../services/authService";

/**
 * Custom hook providing authentication actions for login, signup, and sign out.
 *
 * @returns An object containing:
 * - `login`: Mutation for logging in a user with email and password.
 * - `signUp`: Mutation for signing up a new user with email and password.
 * - `signOut`: Function to log out the current user.
 *
 * Each mutation handles success and error states, displaying toast notifications accordingly.
 */
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
      showToast("Success", "success");
    },
    onError: (error: any) => {
      showToast(error.response.data.message || "Auth error", "error");
    },
  });

  const signOut = async () => {
    await logoutService();
  };
  return { login, signUp, signOut };
};
