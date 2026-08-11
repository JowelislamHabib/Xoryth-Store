import type { Metadata } from "next";
import { serverFetch } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { CatalogFilters } from "@/components/product/catalog-filters";

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[]; q?: string | string[] }>;
}) {
  const sp = await searchParams;
  const categoryId =
    typeof sp.category === "string" ? sp.category : "";
  const query =
    typeof sp.q === "string" ? sp.q.trim().toLowerCase() : "";

  const [{ data: products }, { data: categories }] = await Promise.all([
    serverFetch<Product[]>("/products"),
    serverFetch<Category[]>("/categories"),
  ]);

  const filtered = (products ?? []).filter(
    (p) =>
      (!categoryId || p.categoryId === categoryId) &&
      (!query ||
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)),
  );

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <CatalogFilters categories={categories ?? []} />
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-muted-foreground">
          No products match your filters.
        </p>
      )}
    </div>
  );
}
