import { createClient } from "@/lib/supabase/server";
import AdminsForm from "@/components/admin/AdminsForm";

export default async function DashboardAdminsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
      <h1 className="mb-6 text-2xl font-bold">Manage Admins</h1>
      <AdminsForm currentUserId={user?.id ?? ""} />
    </main>
  );
}
