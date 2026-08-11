import type { Metadata } from "next";
import Link from "next/link";
import { serverFetch } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "My orders",
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

export default async function MyOrdersPage() {
  const { data: orders } = await serverFetch<Order[]>("/orders/my");

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">You have no orders yet.</p>
        <Button asChild>
          <Link href="/products">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">
              {order.id.slice(0, 8)}...
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[order.status]}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatPrice(order.totalPrice)}
            </TableCell>
            <TableCell className="text-right">
              <Button asChild variant="link" size="sm">
                <Link href={`/orders/${order.id}`}>View</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
