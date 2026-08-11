import type { Metadata } from "next";
import Link from "next/link";
import { serverFetch } from "@/lib/api";
import type { Category, Order, OrderStatus, Product, User } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin",
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

export default async function AdminOverviewPage() {
  const [products, categories, orders, users] = await Promise.all([
    serverFetch<Product[]>("/products"),
    serverFetch<Category[]>("/categories"),
    serverFetch<Order[]>("/orders"),
    serverFetch<User[]>("/users"),
  ]);

  const stats = [
    { label: "Products", value: (products.data ?? []).length, href: "/admin/products" },
    { label: "Categories", value: (categories.data ?? []).length, href: "/admin/categories" },
    { label: "Orders", value: (orders.data ?? []).length, href: "/admin/orders" },
    { label: "Users", value: (users.data ?? []).length, href: "/admin/users" },
  ];

  const revenue = (orders.data ?? [])
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const recent = (orders.data ?? []).slice(0, 8);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Store health at a glance
          </p>
        </div>
        <Button render={<Link href="/admin/products" />}>Add product</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value}</p>
              <Button variant="link" size="sm" render={<Link href={s.href} />} className="px-0">
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue (non-cancelled)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{formatPrice(revenue)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="flex flex-col">
              {recent.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-2 border-b py-3 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">{order.id.slice(0, 8)}...</p>
                    <p className="text-xs text-muted-foreground">
                      {order.user?.name ?? "Customer"} &middot;{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={STATUS_VARIANT[order.status]}>
                      {order.status}
                    </Badge>
                    <span className="font-semibold">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
