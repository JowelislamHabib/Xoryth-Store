import type { Metadata } from "next";
import { serverFetch } from "@/lib/api";
import type { User } from "@/lib/types";
import { UserManager } from "@/components/admin/user-manager";

export const metadata: Metadata = {
  title: "Admin users",
};

export default async function AdminUsersPage() {
  const { data: users } = await serverFetch<User[]>("/users");

  return <UserManager users={users ?? []} />;
}
