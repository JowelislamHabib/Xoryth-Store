"use client";

import Link from "next/link";
import Image from "next/image";
import { PackageIcon, Trash2Icon, PlusIcon, MinusIcon } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CartPage() {
  const { items, total, setQuantity, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <PackageIcon className="size-12 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground">
          Looks like you have not added anything yet.
        </p>
        <Button asChild>
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>
        <Button variant="ghost" size="sm" onClick={clear}>
          Clear cart
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="flex gap-4 p-4">
                <Link
                  href={`/products/${item.productId}`}
                  className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <PackageIcon className="size-6 text-muted-foreground" />
                    </div>
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <span className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label="Decrease quantity"
                      disabled={item.quantity <= 1}
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    >
                      <MinusIcon />
                    </Button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label="Increase quantity"
                      disabled={item.quantity >= item.stock}
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    >
                      <PlusIcon />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {formatPrice(item.price)} each
                    </span>
                    <button
                      type="button"
                      aria-label="Remove"
                      onClick={() => removeItem(item.productId)}
                      className="ml-auto text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items</span>
              <span>
                {items.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/checkout">Proceed to checkout</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
