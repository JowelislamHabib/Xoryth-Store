"use client";

import { useState } from "react";
import { PlusIcon, MinusIcon, ShoppingCartIcon } from "lucide-react";
import { useCart, type CartProduct } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

export function AddToCart({
  product,
  variant = "icon",
}: {
  product: CartProduct;
  variant?: "icon" | "full";
}) {
  const { addItem, setOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const soldOut = product.stock <= 0;

  if (variant === "icon") {
    return (
      <Button
        type="button"
        size="icon"
        variant="outline"
        aria-label={`Add ${product.name} to cart`}
        disabled={soldOut}
        onClick={() => {
          addItem(product);
          setOpen(true);
        }}
      >
        <ShoppingCartIcon />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        >
          <MinusIcon />
        </Button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Increase quantity"
          disabled={quantity >= product.stock}
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
        >
          <PlusIcon />
        </Button>
      </div>
      <Button
        type="button"
        disabled={soldOut}
        onClick={() => {
          addItem(product, quantity);
          setOpen(true);
        }}
      >
        Add to cart
      </Button>
    </div>
  );
}
