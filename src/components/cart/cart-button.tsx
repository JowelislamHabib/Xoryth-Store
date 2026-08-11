"use client";

import { ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";

export function CartButton() {
  const { count, setOpen } = useCart();

  return (
    <button
      type="button"
      aria-label="Open cart"
      onClick={() => setOpen(true)}
      className="relative inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
    >
      <ShoppingCartIcon className="size-4" />
      {count > 0 ? (
        <Badge className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full p-0 text-[10px]">
          {count}
        </Badge>
      ) : null}
    </button>
  );
}
