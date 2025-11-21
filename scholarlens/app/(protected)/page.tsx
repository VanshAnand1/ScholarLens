import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Redirect } from "@/components/redirect";

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return JSON.stringify(data.claims, null, 2);
}

export default function ProtectedPage() {
  return (
    <div>
      <UserDetails />
      <Redirect href="/home"></Redirect>
    </div>
  );
}
