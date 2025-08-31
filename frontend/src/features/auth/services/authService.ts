import { supabase } from "@/lib/supabaseClient";

export const loginService = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) throw new Error(error?.message || "Login failed");

  return data;
};

export const signupService = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.session)
    throw new Error(error?.message || "Signup failed");

  return data;
};

export const logoutService = async () => {
  await supabase.auth.signOut();
};
