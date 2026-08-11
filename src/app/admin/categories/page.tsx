import type { Metadata } from "next";
import { serverFetch } from "@/lib/api";
import type { Category } from "@/lib/types";
import { CategoryManager } from "@/components/admin/category-manager";

export const metadata: Metadata = {
  title: "Admin categories",
};

export default async function AdminCategoriesPage() {
  const { data: categories } = await serverFetch<Category[]>("/categories");

  return <CategoryManager categories={categories ?? []} />;
}
