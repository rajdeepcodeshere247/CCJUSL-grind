import AdminPanel from "@/components/Admin/AdminPanel";
import { checkAdminAuthorization } from "@/services/AuthService";
import React from "react";

export default async function AdminRoute() {
  // Enforce ADMIN or SUPERADMIN role, otherwise redirect to /signin
  await checkAdminAuthorization();

  return <AdminPanel />;
}
