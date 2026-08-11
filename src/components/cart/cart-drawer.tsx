"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PackageIcon, PlusIcon, MinusIcon, Trash2Icon } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function CartDrawer() {
  const { items, count, total, isOpen, setOpen, setQuantity, removeItem } =
    useCart();
  const router = useRouter();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex flex-col gap-0 p-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>
            Cart {count > 0 ? `(${count})` : ""}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <PackageIcon className="size-10" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <Link
                    href={`/products/${item.productId}`}
                    onClick={() => setOpen(false)}
                    className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <PackageIcon className="size-5 text-muted-foreground" />
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.productId}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-1 text-sm font-medium hover:underline"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        aria-label="Remove"
                        onClick={() => removeItem(item.productId)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      >
                        <MinusIcon />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        aria-label="Increase quantity"
                        disabled={item.quantity >= item.stock}
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      >
                        <PlusIcon />
                      </Button>
                      <span className="ml-auto text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="border-t px-5 py-4">
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setOpen(false);
                  router.push("/cart");
                }}
              >
                View cart
              </Button>
              <Button
                className="flex-1"
                disabled={items.length === 0}
                onClick={() => {
                  setOpen(false);
                  router.push("/checkout");
                }}
              >
                Checkout
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
