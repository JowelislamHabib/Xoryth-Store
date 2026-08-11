import Image from "next/image";
import Link from "next/link";
import { PackageIcon } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AddToCart } from "@/components/cart/add-to-cart";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock <= 0;
  const cartProduct = {
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    stock: product.stock,
  };

  return (
    <Card className="group overflow-hidden">
      <Link
        href={`/products/${product.id}`}
        className="flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-square w-full bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <PackageIcon className="size-10" />
            </div>
          )}
          {soldOut ? (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 bg-background/80 backdrop-blur"
            >
              Sold out
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">
            {product.category?.name ?? "Product"}
          </p>
          <h3 className="mt-0.5 line-clamp-1 font-medium">{product.name}</h3>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2 px-4 pb-4">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          <div className="flex items-center gap-2">
            {product._count?.reviews ? (
              <span className="text-xs text-muted-foreground">
                {product._count.reviews}{" "}
                {product._count.reviews === 1 ? "review" : "reviews"}
              </span>
            ) : null}
            <AddToCart product={cartProduct} />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
