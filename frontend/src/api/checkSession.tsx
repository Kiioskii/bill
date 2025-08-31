import { supabase } from "@/lib/supabaseClient";

export const checkSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error("Session error");
  console.log("data", data);

  const accessToken = data.session?.access_token;

  if (!accessToken) {
    throw new Error("User not authenticated");
  }
  return accessToken;
};
