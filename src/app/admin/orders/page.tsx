import type { Metadata } from "next";
import { serverFetch } from "@/lib/api";
import type { Order } from "@/lib/types";
import { OrderManager } from "@/components/admin/order-manager";

export const metadata: Metadata = {
  title: "Admin orders",
};

export default async function AdminOrdersPage() {
  const { data: orders } = await serverFetch<Order[]>("/orders");

  return <OrderManager orders={orders ?? []} />;
}
