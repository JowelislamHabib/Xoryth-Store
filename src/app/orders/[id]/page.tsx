import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PackageIcon } from "lucide-react";
import { serverFetch } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { hasAccessToken } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Order",
};

const STATUS_VARIANT: Record<
  OrderStatus,
  "default" | "secondary" | "destructive"
> = {
  PENDING: "secondary",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await hasAccessToken())) {
    redirect("/login");
  }

  const { id } = await params;
  const { data: order } = await serverFetch<Order>(`/orders/${id}`);

  if (!order) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Order {order.id}
          </h1>
          <p className="text-sm text-muted-foreground">
            Placed {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[order.status]}>{order.status}</Badge>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {order.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Order placed successfully.
            </p>
          ) : (
            order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b py-3 last:border-b-0"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                  {item.product?.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <PackageIcon className="size-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  {item.product ? (
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-medium hover:underline"
                    >
                      {item.product.name}
                    </Link>
                  ) : (
                    <span className="font-medium">Product</span>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.price)} &times; {item.quantity}
                  </p>
                </div>
                <span className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="text-lg font-semibold">
            {formatPrice(order.totalPrice)}
          </span>
        </CardFooter>
      </Card>

      <Button
        variant="outline"
        render={<Link href="/account/orders" />}
        className="mt-6"
      >
        Back to my orders
      </Button>
    </div>
  );
}
