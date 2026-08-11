import type { Metadata } from "next";
import { serverFetch } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { ProductManager } from "@/components/admin/product-manager";

export const metadata: Metadata = {
  title: "Admin products",
};

export default async function AdminProductsPage() {
  const [{ data: products }, { data: categories }] = await Promise.all([
    serverFetch<Product[]>("/products"),
    serverFetch<Category[]>("/categories"),
  ]);

  return (
    <ProductManager products={products ?? []} categories={categories ?? []} />
  );
}
