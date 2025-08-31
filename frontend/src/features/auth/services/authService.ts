import { supabase } from "@/lib/supabaseClient";

/**
 * Authenticates a user using their email and password via Supabase.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves with the authentication data if successful.
 * @throws Throws an error if authentication fails or no session is returned.
 */
export const loginService = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) throw new Error(error?.message || "Login failed");

  return data;
};

/**
 * Registers a new user using the provided email and password via Supabase authentication.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves with the signup response data.
 * @throws Throws an error if signup fails or if no session is returned.
 */
export const signupService = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.session)
    throw new Error(error?.message || "Signup failed");

  return data;
};

/**
 * Signs out the currently authenticated user using Supabase authentication.
 *
 * @returns {Promise<void>} A promise that resolves when the user has been signed out.
 */
export const logoutService = async () => {
  await supabase.auth.signOut();
};
