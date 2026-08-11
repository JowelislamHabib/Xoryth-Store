"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client-api";
import type { Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUSES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

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

export function OrderManager({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<Order | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(order: Order, status: OrderStatus) {
    const res = await api<Order>(`/orders/${order.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (res.status >= 400) {
      setError(res.message || "Update failed");
      return;
    }
    router.refresh();
  }

  async function remove() {
    if (!deleting) return;
    setPending(true);
    setError(null);
    const res = await api<Order>(`/orders/${deleting.id}`, {
      method: "DELETE",
    });
    setPending(false);
    if (res.status >= 400) {
      setError(res.message || "Delete failed");
      return;
    }
    setDeleting(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">{orders.length} orders</p>
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-destructive">{error}</p>
      ) : null}

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No orders yet.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell>{order.user?.name ?? "Customer"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value) =>
                      value && updateStatus(order, value as OrderStatus)
                    }
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue>
                        <Badge variant={STATUS_VARIANT[order.status]}>
                          {order.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(order.totalPrice)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/orders/${order.id}`} />}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 text-destructive"
                    onClick={() => setDeleting(order)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Delete order"
        description={
          deleting ? `Delete order ${deleting.id.slice(0, 8)}...?` : ""
        }
        onConfirm={remove}
        pending={pending}
      />
    </div>
  );
}
