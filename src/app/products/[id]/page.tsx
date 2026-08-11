import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageIcon } from "lucide-react";
import { serverFetch } from "@/lib/api";
import type { Product, Review } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { getSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RatingStars } from "@/components/product/rating-stars";
import { ReviewItem } from "@/components/product/review-item";
import { ReviewForm } from "@/components/product/review-form";
import { AddToCart } from "@/components/cart/add-to-cart";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await serverFetch<Product>(`/products/${id}`);
  return { title: data?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  const [{ data: product }, { data: reviews }] = await Promise.all([
    serverFetch<Product>(`/products/${id}`),
    serverFetch<Review[]>(`/reviews/product/${id}`),
  ]);

  if (!product) notFound();

  const reviewList = reviews ?? [];
  const average =
    reviewList.length > 0
      ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length
      : 0;
  const myReview = session
    ? reviewList.find((r) => r.userId === session.id)
    : undefined;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <Button variant="link" render={<Link href="/products" />} className="mb-4 px-0">
        &larr; Back to products
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <PackageIcon className="size-16" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {product.category?.name ?? "Product"}
          </p>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-2">
            <RatingStars rating={Math.round(average)} />
            <span className="text-sm text-muted-foreground">
              {average > 0 ? average.toFixed(1) : "No reviews yet"}
            </span>
          </div>
          <p className="text-2xl font-semibold">
            {formatPrice(product.price)}
          </p>
          <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="w-fit">
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Sold out"}
          </Badge>
          {product.description ? (
            <p className="text-muted-foreground">{product.description}</p>
          ) : null}
          <AddToCart
            variant="full"
            product={{
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              stock: product.stock,
            }}
          />
        </div>
      </div>

      <Separator className="my-10" />

      <section>
        <h2 className="text-2xl font-semibold tracking-tight">
          Customer reviews
        </h2>
        <div className="mt-6 grid gap-10 lg:grid-cols-[280px_1fr]">
          <div>
            {reviewList.length > 0 ? (
              <>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-bold leading-none tracking-tight">
                    {average.toFixed(1)}
                  </span>
                  <div className="flex flex-col gap-1 pb-0.5">
                    <RatingStars rating={average} size="lg" />
                    <span className="text-sm text-muted-foreground">
                      {reviewList.length}{" "}
                      {reviewList.length === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  {[5, 4, 3, 2, 1].map((n) => {
                    const count = reviewList.filter(
                      (r) => r.rating === n,
                    ).length;
                    const pct = Math.round((count / reviewList.length) * 100);
                    return (
                      <div
                        key={n}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span className="w-9 shrink-0 text-right">{n}★</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-7 shrink-0 tabular-nums">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No ratings yet for this product.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-10">
            <div>
              <h3 className="text-lg font-semibold">Reviews</h3>
              {reviewList.length > 0 ? (
                <div className="mt-2 flex flex-col divide-y">
                  {reviewList.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Be the first to review this product.
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                {myReview ? "Your review" : "Write a review"}
              </h3>
              <div className="mt-2">
                {session ? (
                  <ReviewForm productId={product.id} existing={myReview} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    <Button
                      variant="link"
                      render={
                        <Link
                          href={`/login?next=${encodeURIComponent(`/products/${product.id}`)}`}
                        />
                      }
                      className="px-0"
                    >
                      Sign in
                    </Button>{" "}
                    to leave a review.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
