import { supabase } from "@/integrations/supabase/client";


export async function getAdminSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}


export async function adminLogin(
  email: string,
  password: string
) {

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });


  if (error) {
    throw error;
  }


  return data.session;
}



export async function adminLogout() {
  await supabase.auth.signOut();
}