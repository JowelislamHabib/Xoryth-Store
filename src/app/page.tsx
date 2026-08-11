import Link from "next/link";
import { serverFetch } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const [{ data: products }, { data: categories }] = await Promise.all([
    serverFetch<Product[]>("/products"),
    serverFetch<Category[]>("/categories"),
  ]);

  const featured = (products ?? []).slice(0, 8);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <section className="flex flex-col items-start gap-6 rounded-2xl bg-muted/50 p-8 sm:p-12">
        <div className="flex max-w-xl flex-col gap-3">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Find your next favorite thing
          </h1>
          <p className="text-lg text-muted-foreground">
            Shop curated products with honest reviews. Fast checkout, tracked
            orders.
          </p>
        </div>
        <Button render={<Link href="/products" />} size="lg">
          Browse products
        </Button>
      </section>

      {categories && categories.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">Categories</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                render={<Link href={`/products?category=${category.id}`} />}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Featured</h2>
          <Button variant="link" render={<Link href="/products" />}>
            View all
          </Button>
        </div>
        {featured.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">
            No products yet. Check back soon.
          </p>
        )}
      </section>
    </div>
  );
}
