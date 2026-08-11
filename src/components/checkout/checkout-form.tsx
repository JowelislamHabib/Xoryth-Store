"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client-api";
import type { Order } from "@/lib/types";
import { getClientSession } from "@/lib/session-client";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CheckoutForm() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const session = getClientSession();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Nothing to check out
        </h1>
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild>
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  async function placeOrder() {
    if (!session) {
      router.push("/login?next=/checkout");
      return;
    }
    setPending(true);
    setError(null);

    await api(`/users/${session.id}`, {
      method: "PATCH",
      body: JSON.stringify({ address, phone }),
    }).catch(() => null);

    const res = await api<Order>("/orders", {
      method: "POST",
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      }),
    });

    setPending(false);
    if (res.status >= 400 || !res.data) {
      setError(res.message || "Order failed");
      return;
    }

    clear();
    router.replace(`/orders/${res.data.id}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader>
          <CardTitle>Shipping details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city, country"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
            />
          </div>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between gap-2">
              <span className="line-clamp-1 text-muted-foreground">
                {item.name} &times; {item.quantity}
              </span>
              <span className="shrink-0 font-medium">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t pt-3">
            <span className="font-medium">Total</span>
            <span className="font-semibold">{formatPrice(total)}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            disabled={pending}
            onClick={placeOrder}
          >
            {pending ? "Placing order..." : "Place order"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
